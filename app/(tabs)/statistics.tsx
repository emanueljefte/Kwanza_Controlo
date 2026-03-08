import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransitionList from "@/components/TransitionList";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { getRandomColor } from "@/constants/icons";
import { useAuth } from "@/contexts/AuthProvider";
import * as schema from "@/db/schema";
import { exportToPDF } from "@/services/pdfService";
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/services/transictionService";
import { TransactionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Icons from "phosphor-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";

export default function Statistic() {
  const [chartType, setChartType] = useState("bar");
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const { user } = useAuth();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchStats(); // Chama direto aqui ao ganhar foco
    }, [activeIndex]), // Se mudar o index enquanto está em foco, ele não precisa do refreshKey
  );

  const fetchStats = async () => {
    setChartLoading(true);
    let res;
    if (activeIndex === 0)
      res = await fetchWeeklyStats(drizzleDb, user?.uid as string);
    else if (activeIndex === 1)
      res = await fetchMonthlyStats(drizzleDb, user?.uid as string);
    else res = await fetchYearlyStats(drizzleDb, user?.uid as string);

    setChartLoading(false);
    if (res.success) {
      setChartData(res.data.stats);
      setTransactions(res.data.transactions);
    } else {
      Alert.alert("Erro", res.msg);
    }
  };

  // Memoize os dados da pizza para evitar cálculos desnecessários
  const pieData = useMemo(() => {
    const categories: any = {};

    // Filtra despesas e soma por categoria
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const cat = t.category || "Outros";
        categories[cat] = (categories[cat] || 0) + Number(t.amount);
      });

    return Object.keys(categories).map((key) => ({
      value: categories[key],
      label: key,
      // GARANTA QUE A COR SEJA ATRIBUÍDA AQUI
      color: getRandomColor(key),
      gradientCenterColor: getRandomColor(key), // Opcional: para um visual melhor com gradiente
      text: key,
    }));
  }, [transactions]);

  const handleExport = () => {
    // Calcula totais rápidos para o cabeçalho do PDF
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    exportToPDF(transactions, { totalIncome, totalExpense });
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Estatísticas" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={handleExport}
            style={{ alignSelf: "flex-end", padding: 10 }}
          >
            <Icons.FilePdf size={28} color={Colors.primary} weight="fill" />
            <Typo size={12}>Exportar PDF</Typo>
          </TouchableOpacity>
          {/* Seletor de Período */}
          <SegmentedControl
            values={["Semanal", "Mensal", "Anual"]}
            selectedIndex={activeIndex}
            onChange={(event) =>
              setActiveIndex(event.nativeEvent.selectedSegmentIndex)
            }
            tintColor={"#adabab"}
            backgroundColor={"#f97316"}
            appearance="dark"
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={styles.segmentFontStyle}
          />

          {/* Card do Gráfico */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Typo size={16} color="#fff" fontWeight="600">
                Resumo Visual
              </Typo>
              <View style={styles.chartTypeToggle}>
                <TouchableOpacity onPress={() => setChartType("bar")}>
                  <Icons.ChartBarIcon
                    size={22}
                    weight={chartType === "bar" ? "fill" : "regular"}
                    color={chartType === "bar" ? Colors.primary : "#666"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setChartType("pie")}>
                  <Icons.ChartPieIcon
                    size={22}
                    weight={chartType === "pie" ? "fill" : "regular"}
                    color={chartType === "pie" ? Colors.primary : "#666"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.mainChartWrapper}>
              {chartLoading ? (
                <Loading />
              ) : (
                <>
                  {chartType === "bar" ? (
                    chartData.length > 0 ? (
                      <View style={{ width: "100%", alignItems: "center" }}>
                        {/* Legenda Manual para Barras */}
                        <View style={styles.barLegend}>
                          <View style={styles.legendItem}>
                            <View
                              style={[styles.dot, { backgroundColor: "#2f4" }]}
                            />
                            <Typo size={12} color="#AAA">
                              Renda
                            </Typo>
                          </View>
                          <View style={styles.legendItem}>
                            <View
                              style={[
                                styles.dot,
                                { backgroundColor: "rgb(244, 36, 71)" },
                              ]}
                            />
                            <Typo size={12} color="#AAA">
                              Despesa
                            </Typo>
                          </View>
                        </View>

                        <BarChart
                          data={chartData}
                          barWidth={scale(10)}
                          spacing={scale(24)}
                          roundedTop
                          noOfSections={3}
                          yAxisThickness={0}
                          xAxisThickness={1}
                          xAxisColor={"#444"} // Linha do eixo X visível
                          yAxisTextStyle={{ color: "#aaa", fontSize: 10 }}
                          xAxisLabelTextStyle={{ color: "#aaa", fontSize: 10 }}
                          hideRules={false}
                          rulesColor={"#333"} // Linhas de grade sutis
                          backgroundColor={"transparent"} // Garante que não use fundo preto padrão
                          initialSpacing={15}
                          dashWidth={0}
                        />
                      </View>
                    ) : (
                      <Typo color="#666">Sem dados</Typo>
                    )
                  ) : pieData.length > 0 ? (
                    <View style={styles.pieWrapper}>
                      <PieChart
                        data={pieData}
                        donut
                        showGradient
                        radius={scale(70)}
                        innerRadius={scale(50)}
                        innerCircleColor={"#1A1A1A"}
                        centerLabelComponent={() => (
                          <View style={{ alignItems: "center" }}>
                            <Typo size={12} color="#888">
                              Gastos
                            </Typo>
                            <Typo size={14} fontWeight="700">
                              AOA
                            </Typo>
                          </View>
                        )}
                      />
                      {/* Legenda Lateral Simples */}
                      <View style={styles.legendContainer}>
                        {pieData.slice(0, 3).map((item, index) => (
                          <View key={index} style={styles.legendItem}>
                            <View
                              style={[
                                styles.dot,
                                { backgroundColor: item.color },
                              ]}
                            />
                            <Typo size={12} color="#AAA">
                              {item.label}
                            </Typo>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : (
                    <Typo color="#666">Sem gastos registrados</Typo>
                  )}
                </>
              )}
            </View>
          </View>
          {chartLoading ? (
            <Loading />
          ) : (
            <TransitionList
              title="Transações do Período"
              emptyListMessage="Nenhuma transação encontrada"
              data={transactions}
            />
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  scrollContent: {
    gap: scale(20),
    paddingTop: scale(10),
    paddingBottom: verticalScale(100),
  },
  segmentStyle: {
    height: scale(40),
    borderRadius: 12,
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: "#fff",
  },
  chartCard: {
    backgroundColor: "#1F1F1F", // Um cinza levemente mais claro para dar profundidade
    borderRadius: 28,
    padding: scale(20),
    // Borda sutil para definir o limite do card
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    // Sombra para "tirar" o card do fundo da tela
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8, // Para Android
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(10),
  },
  chartTypeToggle: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#2A2A2A",
    padding: 4,
    borderRadius: 14,
  },
  toggleButton: {
    // Novo estilo para o botão de toggle
    padding: 8,
    borderRadius: 10,
  },
  activeToggle: {
    backgroundColor: "#3A3A3A",
  },
  mainChartWrapper: {
    height: verticalScale(260),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: scale(10),
    backgroundColor: "#181818", // Área do gráfico levemente mais escura para contraste interno
    borderRadius: 20,
    padding: scale(10),
  },
  pieWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  legendContainer: {
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  barLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 15, // Espaço entre legenda e gráfico
  },
});
