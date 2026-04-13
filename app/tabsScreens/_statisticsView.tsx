import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransitionList from "@/components/TransitionList";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { TransactionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import * as Icons from "phosphor-react-native";
import React, { RefObject, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import ViewShot from "react-native-view-shot";

type StatisticViewProps = {
  index: number;
  loading: boolean;
  data: any[];
  pieData: any[];
  statsRef: RefObject<null>;
  transactions: TransactionType[];
  onExport: () => void;
  setIndex: (value: number) => void;
};

export default function StatisticView({
  onExport,
  setIndex,
  loading,
  statsRef,
  index,
  data,
  pieData,
  transactions,
}: StatisticViewProps) {
  const [chartType, setChartType] = useState("bar");

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Estatísticas" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={onExport}
            style={{ alignSelf: "flex-end", padding: 10 }}
          >
            <Icons.FilePdf
              size={28}
              color={Colors.dark.primary}
              weight="fill"
            />
            <Typo size={12}>Exportar PDF</Typo>
          </TouchableOpacity>
          {/* Seletor de Período */}
          <SegmentedControl
            values={["Semanal", "Mensal", "Anual"]}
            selectedIndex={index}
            onChange={(event) =>
              setIndex(event.nativeEvent.selectedSegmentIndex)
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
                    color={chartType === "bar" ? Colors.dark.primary : "#666"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setChartType("pie")}>
                  <Icons.ChartPieIcon
                    size={22}
                    weight={chartType === "pie" ? "fill" : "regular"}
                    color={chartType === "pie" ? Colors.dark.primary : "#666"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              {loading ? (
                <Loading />
              ) : (
                <>
                  {chartType === "bar" ? (
                    data.length > 0 ? (
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
                        <ViewShot
                          ref={statsRef}
                          options={{
                            format: "jpg",
                            quality: 0.9,
                            result: "base64",
                          }}
                        >
                          <BarChart
                            data={data}
                            barWidth={scale(10)}
                            spacing={scale(14)}
                            roundedTop
                            noOfSections={3}
                            yAxisThickness={0}
                            xAxisThickness={1}
                            xAxisColor={"#444"} // Linha do eixo X visível
                            yAxisTextStyle={{ color: "#aaa", fontSize: 10 }}
                            xAxisLabelTextStyle={{
                              color: "#aaa",
                              fontSize: 10,
                              textAlign: "center",
                            }}
                            hideRules={false}
                            rulesColor={"#333"}
                            backgroundColor={"transparent"}
                            initialSpacing={15}
                            dashWidth={0}
                          />
                        </ViewShot>
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
                        sectionAutoFocus
                        focusOnPress
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
          {loading ? (
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
