import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useFocusEffect } from "expo-router";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CardsIcon,
  CheckCircleIcon,
  DotsThreeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Typo from "./Typo";

export default function HomeCard() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const { theme } = useTheme();
  const activeColors = Colors[theme];
  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const { data: wallets, loading: walletLoading } = useFetchData<WalletType>(
    "wallets",
    { uid: user?.uid as string, orderBy: "created", sort: "desc" },
    refreshKey,
  );

  const getTotals = () => {
    // Se uma carteira específica estiver selecionada, mostra o saldo dela
    if (selectedWallet) {
      return {
        balance: Number(selectedWallet.amount),
        income: Number(selectedWallet.totalIncome),
        expense: Number(selectedWallet.totalExpenses),
      };
    }
    // Caso contrário, mostra o total de todas
    return wallets.reduce(
      (totals, item) => {
        totals.balance += Number(item.amount);
        totals.income += Number(item.totalIncome);
        totals.expense += Number(item.totalExpenses);
        return totals;
      },
      { balance: 0, income: 0, expense: 0 },
    );
  };

  const formatMoney = (value: number) => {
    return value.toLocaleString("pt-AO", {
      minimumFractionDigits: 2,
    });
  };

  const totals = getTotals();

  return (
    <View style={styles.container}>
      {/* HEADER DO CARD */}
      <View style={styles.totalBalanceRow}>
        <Typo
          color="white"
          size={16}
          fontWeight={"500"}
          style={{ opacity: 0.8 }}
        >
          {selectedWallet ? `Saldo: ${selectedWallet.name}` : "Balanço Total"}
        </Typo>
        <Pressable hitSlop={10} onPress={() => setShowModal(true)}>
          <DotsThreeIcon size={verticalScale(30)} color="white" weight="bold" />
        </Pressable>
      </View>

      {/* SALDO PRINCIPAL */}
      <View style={styles.balanceContainer}>
        <Typo color="white" size={34} fontWeight={"800"}>
          {walletLoading
            ? "----,--"
            : isBalanceVisible
              ? formatMoney(totals.balance)
              : "*******"}
          <Typo color="white" size={18} fontWeight={"600"}>
            {" "}
            KZ
          </Typo>
        </Typo>
      </View>

      {/* STATS (RECEITA E DESPESA) */}
      <View style={styles.statsContainer}>
        {/* ENTRADA */}
        <View style={styles.statItem}>
          <View style={styles.incomeExpenseHeader}>
            <View
              style={[
                styles.statsIcon,
                { backgroundColor: "rgba(255,255,255,0.2)" },
              ]}
            >
              <ArrowDownLeftIcon
                size={verticalScale(16)}
                color="#4ade80"
                weight="bold"
              />
            </View>
            <Typo
              size={14}
              color="white"
              fontWeight={"500"}
              style={{ opacity: 0.9 }}
            >
              Receitas
            </Typo>
          </View>
          <Typo size={16} color="white" fontWeight={"700"}>
            {walletLoading ? "---" : `+ ${formatMoney(totals.income)}`}
          </Typo>
        </View>

        <View style={styles.divider} />

        {/* SAÍDA */}
        <View style={styles.statItem}>
          <View style={styles.incomeExpenseHeader}>
            <View
              style={[
                styles.statsIcon,
                { backgroundColor: "rgba(255,255,255,0.2)" },
              ]}
            >
              <ArrowUpRightIcon
                size={verticalScale(16)}
                color="#f32d2d"
                weight="bold"
              />
            </View>
            <Typo
              size={14}
              color="white"
              fontWeight={"500"}
              style={{ opacity: 0.9 }}
            >
              Despesas
            </Typo>
          </View>
          <Typo size={16} color="white" fontWeight={"700"}>
            {walletLoading ? "---" : `- ${formatMoney(totals.expense)}`}
          </Typo>
        </View>
      </View>

      {/* MODAL DE OPÇÕES */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: activeColors.navBackground },
            ]}
          >
            <Typo size={18} fontWeight="700" style={{ marginBottom: 15 }}>
              Opções
            </Typo>

            {/* Ação 1: Esconder/Mostrar Saldo */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setIsBalanceVisible(!isBalanceVisible);
                setShowModal(false);
              }}
            >
              {isBalanceVisible ? (
                <EyeSlashIcon size={22} color="#444" />
              ) : (
                <EyeIcon size={22} color="#444" />
              )}
              <Typo size={16}>
                {isBalanceVisible ? "Ocultar Saldo" : "Mostrar Saldo"}
              </Typo>
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <Typo size={14} color="#666" style={{ marginVertical: 10 }}>
              Selecionar Carteira:
            </Typo>

            {/* Lista de Carteiras para Alternar */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSelectedWallet(null);
                setShowModal(false);
              }}
            >
              <CardsIcon
                size={22}
                color={!selectedWallet ? Colors.primary : "#444"}
              />
              <Typo color={!selectedWallet ? Colors.primary : ""}>
                Todas as Contas
              </Typo>
              {!selectedWallet && (
                <CheckCircleIcon
                  size={20}
                  color={Colors.primary}
                  weight="fill"
                />
              )}
            </TouchableOpacity>

            {wallets.map((w) => (
              <TouchableOpacity
                key={w.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedWallet(w);
                  setShowModal(false);
                }}
              >
                <View style={[styles.dot, { backgroundColor: "#ccc" }]} />
                <Typo color={selectedWallet?.id === w.id ? Colors.primary : ""}>
                  {w.name}
                </Typo>
                {selectedWallet?.id === w.id && (
                  <CheckCircleIcon
                    size={20}
                    color={Colors.primary}
                    weight="fill"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: scale(22),
    backgroundColor: Colors.primary, // Cor predominante do app
    borderRadius: verticalScale(28),
    width: "100%",
    height: verticalScale(200),
    justifyContent: "space-between",
    // Sombra para profundidade
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceContainer: {
    marginVertical: verticalScale(10),
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)", // Efeito de vidro escuro
    padding: scale(12),
    borderRadius: verticalScale(20),
  },
  statItem: {
    flex: 1,
    gap: verticalScale(4),
  },
  incomeExpenseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    marginBottom: verticalScale(2),
  },
  statsIcon: {
    padding: scale(6),
    borderRadius: 50,
  },
  divider: {
    width: 1,
    height: "70%",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: scale(10),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderColor: "white",
    padding: scale(20),
    paddingBottom: verticalScale(40),
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 15,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 5,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
