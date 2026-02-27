import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import WalletListItem from "@/components/WalletListItem";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthProvider";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Ionicons } from "@expo/vector-icons"; // Troquei para Ionicons por ser mais moderno
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

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

  // Formatação de moeda para o padrão de Angola
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header de Saldo Total */}
        <View style={styles.balanceHeader}>
          <Typo size={16} color="#AAA" fontWeight="500">
            Saldo Total Disponível
          </Typo>
          <View style={styles.balanceRow}>
            <Typo size={40} fontWeight="700">
              {formatCurrency(getTotalBalance())}
            </Typo>
            <Typo
              size={18}
              color={Colors.primary}
              style={{ marginLeft: 5, marginBottom: 8 }}
            >
              KZ
            </Typo>
          </View>
        </View>

        {/* Lista de Carteiras / Cartões */}
        <View style={styles.contentContainer}>
          <View style={styles.listHeader}>
            <View>
              <Typo size={22} fontWeight="600">
                Minhas Contas
              </Typo>
              <Typo size={14} color="#888">
                {wallets.length} carteiras ativas
              </Typo>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.addButton}
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <Ionicons name="add" color={"#fff"} size={scale(28)} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <Loading />
          ) : (
            <FlatList
              data={wallets}
              renderItem={({ item, index }) => (
                <WalletListItem item={item} index={index} router={router} />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Typo color="#666" size={16}>
                    Nenhuma carteira encontrada.
                  </Typo>
                  <Typo color="#444" size={14}>
                    Clique no + para adicionar.
                  </Typo>
                </View>
              }
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceHeader: {
    height: verticalScale(160),
    justifyContent: "center",
    alignItems: "center",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A", // Cinza escuro para contraste
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    padding: scale(20),
    paddingTop: scale(30),
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  addButton: {
    height: scale(45),
    width: scale(45),
    borderRadius: 15, // Quadrado arredondado fica mais moderno
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  listContent: {
    paddingBottom: verticalScale(100),
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: verticalScale(50),
  },
});
