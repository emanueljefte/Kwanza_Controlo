import HomeCard from "@/components/HomeCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransitionList from "@/components/TransitionList";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthProvider";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useFocusEffect, useRouter } from "expo-router";
import { MagnifyingGlass, Plus } from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Home() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

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
    <ScreenWrapper>
      <View style={styles.container}>
        {/* HEADER PERSONALIZADO */}
        <View style={styles.header}>
          <View>
            <Typo size={16} color="#666" fontWeight={"500"}>
              {getGreeting()}, {getEmoji()}
            </Typo>
            <Typo size={26} fontWeight={"700"}>
              {user?.name?.split(" ")[0]}
            </Typo>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(modals)/searchModal")}
            style={styles.searchButton}
            activeOpacity={0.7}
          >
            <MagnifyingGlass
              size={verticalScale(22)}
              color={Colors.primary}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ÁREA DO CARTÃO DE BALANÇO */}
          <View style={styles.cardWrapper}>
            <HomeCard />
          </View>

          {/* LISTA DE TRANSAÇÕES */}
          <View style={styles.listWrapper}>
            <TransitionList
              data={recentTransaction}
              title="Atividade Recente"
              loading={transactionLoading}
              emptyListMessage="Nenhuma transação encontrada."
            />
          </View>

          {/* Espaço extra para o Scroll não parar embaixo do botão */}
          <View style={{ height: verticalScale(100) }} />
        </ScrollView>

        {/* BOTÃO FLUTUANTE (FAB) */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: Colors.primary }]}
          onPress={() => router.push("/(modals)/transactionModel")}
          activeOpacity={0.9}
        >
          <Plus color={"#fff"} size={verticalScale(30)} weight="bold" />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(15),
    marginBottom: verticalScale(25),
  },
  searchButton: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    // Sombra suave para o botão de busca
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  cardWrapper: {
    marginBottom: verticalScale(30),
  },
  listWrapper: {
    flex: 1,
  },
  fab: {
    height: verticalScale(60),
    width: verticalScale(60),
    borderRadius: 20, // Estilo Squircle (mais moderno que redondo total)
    position: "absolute",
    bottom: verticalScale(30),
    right: scale(0),
    justifyContent: "center",
    alignItems: "center",
    // Sombra forte para o FAB
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
});
