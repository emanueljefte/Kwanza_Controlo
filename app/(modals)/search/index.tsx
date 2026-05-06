import { useAuth } from "@/contexts/AuthProvider";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import SearchModalView from "./_searchModalView";

export default function SearchModal() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Referência para focar o input automaticamente
  const inputRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
      // Pequeno delay para garantir que o modal abriu antes de focar
      setTimeout(() => inputRef.current?.focus(), 100);
    }, []),
  );

  const { data: allTransaction, loading: transactionLoading } =
    useFetchData<TransactionType>(
      "transactions",
      { uid: user?.uid as string, orderBy: "date", sort: "desc" },
      refreshKey,
    );

  const filteredTransaction = allTransaction.filter((item) => {
    if (search.length > 1) {
      const s = search.toLowerCase();
      return (
        item.category?.toLowerCase()?.includes(s) ||
        item.type?.toLowerCase()?.includes(s) ||
        item.description?.toLowerCase()?.includes(s) ||
        item.amount?.toString()?.includes(s) ||
        item.walletName?.toLowerCase()?.includes(s)
      );
    }
    return true;
  });

  return (
    <SearchModalView
      input={inputRef}
      loading={transactionLoading}
      search={search}
      setSearch={setSearch}
      transaction={filteredTransaction}
    />
  );
}
