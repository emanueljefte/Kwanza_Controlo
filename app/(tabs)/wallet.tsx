import { useAuth } from "@/contexts/AuthProvider";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import WalletView from "../tabsScreens/_walletView";

export default function Wallet() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const { data: wallets, loading } = useFetchData<WalletType>(
    "wallets",
    {
      uid: user?.uid as string,
      orderBy: "created",
      sort: "desc",
    },
    refreshKey,
  );

  const getTotalBalance = () =>
    wallets.reduce((total, item) => total + (item.amount || 0), 0);

  return (
    <WalletView
      loading={loading}
      wallets={wallets}
      getTotalBalance={getTotalBalance}
    />
  );
}
