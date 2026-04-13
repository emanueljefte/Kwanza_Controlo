import HomeCard from "@/components/HomeCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransitionList from "@/components/TransitionList";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { TransactionType, UserType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import { MagnifyingGlassIcon, PlusIcon } from "phosphor-react-native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type HomeViewProps = {
  loading: boolean;
  transaction: TransactionType[];
  user: UserType;
  getGreeting: () => void;
  getEmoji: () => void;
};

export default function HomeView({
  user,
  loading,
  transaction,
  getGreeting,
  getEmoji,
}: HomeViewProps) {
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
            onPress={() => router.push("/(modals)/search")}
            style={styles.searchButton}
            activeOpacity={0.7}
          >
            <MagnifyingGlassIcon
              size={verticalScale(22)}
              color={Colors.dark.primary}
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
              data={transaction}
              title="Atividade Recente"
              loading={loading}
              emptyListMessage="Nenhuma transação encontrada."
            />
          </View>

          {/* Espaço extra para o Scroll não parar embaixo do botão */}
          <View style={{ height: verticalScale(100) }} />
        </ScrollView>

        {/* BOTÃO FLUTUANTE (FAB) */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: Colors.dark.primary }]}
          onPress={() => router.push("/(modals)/transaction")}
          activeOpacity={0.9}
        >
          <PlusIcon color={"#fff"} size={verticalScale(30)} weight="bold" />
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
    marginBottom: verticalScale(20),
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
    right: scale(10),
    justifyContent: "center",
    alignItems: "center",
    // Sombra forte para o FAB
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
});
