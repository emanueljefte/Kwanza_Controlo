import { useAuth } from "@/contexts/AuthProvider";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import HomeView from "../tabsScreens/_homeView";

export default function Home() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Se quiser adicionar o emoji correspondente
  const getEmoji = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "☀️";
    if (hour >= 12 && hour < 18) return "🌤️";
    return "🌙";
  };
  const { data: recentTransaction, loading: transactionLoading } =
    useFetchData<TransactionType>(
      "transactions",
      { uid: user?.uid as string, orderBy: "date", sort: "desc" },
      refreshKey,
    );

  return (
    <HomeView
      getEmoji={getEmoji}
      getGreeting={getGreeting}
      loading={transactionLoading}
      transaction={recentTransaction}
      user={user}
    />
  );
}
