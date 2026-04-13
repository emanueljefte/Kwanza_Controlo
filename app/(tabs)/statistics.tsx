import { getRandomColor } from "@/constants/icons";
import { useAuth } from "@/contexts/AuthProvider";
import { exportToPDF } from "@/services/pdfService";
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/services/transictionService";
import { TransactionType } from "@/types";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import StatisticView from "../tabsScreens/_statisticsView";

export default function Statistic() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const { user } = useAuth();
  const statsRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [activeIndex]),
  );

  const fetchStats = async () => {
    setChartLoading(true);
    let res;
    if (activeIndex === 0) res = await fetchWeeklyStats(user?.uid as string);
    else if (activeIndex === 1)
      res = await fetchMonthlyStats(user?.uid as string);
    else res = await fetchYearlyStats(user?.uid as string);

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

  const handleExport = async () => {
    try {
      // 1. Verificação de segurança para a Ref
      if (!statsRef.current) {
        Alert.alert("Erro", "O gráfico ainda não carregou totalmente.");
        return;
      }

      // 2. Criar o objeto stats que estava em falta
      const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const stats = { totalIncome, totalExpense };

      // 3. Captura da imagem (Garante que a Ref está no ViewShot dentro do StatisticView)
      const base64Image = await statsRef.current.capture();

      // 4. Exportação
      await exportToPDF(
        transactions,
        stats,
        `data:image/jpg;base64,${base64Image}`,
      );
    } catch (error) {
      console.error("Erro ao exportar:", error);
      Alert.alert("Erro", "Não foi possível gerar o PDF.");
    }
  };

  return (
    <StatisticView
      data={chartData}
      index={activeIndex}
      statsRef={statsRef}
      setIndex={setActiveIndex}
      loading={chartLoading}
      transactions={transactions}
      pieData={pieData}
      onExport={handleExport}
    />
  );
}
