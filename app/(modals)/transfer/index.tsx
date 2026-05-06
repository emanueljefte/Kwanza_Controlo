import { router } from "expo-router";
import {
    ArrowsLeftRight,
    CaretLeftIcon,
    CheckCircle,
    Warning,
} from "phosphor-react-native";
import { useMemo, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { scale, verticalScale } from "@/utils/styling";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthProvider";
import useFetchData from "@/hooks/useFetchData";
import { WalletsTransfer } from "@/services/walletService";
import { WalletType } from "@/types";

export default function TransferModal() {
  const { user } = useAuth();
  const { data: wallets, loading } = useFetchData<WalletType>("wallets", {
    uid: user?.uid as string,
  });

  const [fromWalletId, setFromWalletId] = useState<number | null>(null);
  const [toWalletId, setToWalletId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Encontra os objetos das carteiras selecionadas para mostrar o saldo
  const fromWallet = useMemo(
    () => wallets.find((w) => w.id === fromWalletId),
    [fromWalletId, wallets],
  );
  const toWallet = useMemo(
    () => wallets.find((w) => w.id === toWalletId),
    [toWalletId, wallets],
  );

  const handleTransfer = async () => {
    const value = parseFloat(amount);

    if (!fromWalletId || !toWalletId || isNaN(value) || value <= 0) {
      Alert.alert("Erro", "Por favor, preencha todos os campos corretamente.");
      return;
    }

    if (value > (fromWallet?.amount || 0)) {
      Alert.alert(
        "Saldo Insuficiente",
        `A carteira ${fromWallet?.name} não tem saldo suficiente.`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await WalletsTransfer(
        value,
        fromWalletId,
        toWalletId,
        user?.uid as string,
        fromWallet?.name as string,
        toWallet?.name as string,
      );

      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar a transferência.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* HEADER */}
        <Header
          style={styles.header}
          title="Transferir Saldo"
          leftIcon={
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <CaretLeftIcon size={24} color="#fff" weight="bold" />
            </TouchableOpacity>
          }
        />
        <View style={{ width: 24 }} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* INPUT DE VALOR */}
          <View style={styles.amountContainer}>
            <Typo color="#888" size={14} style={{ textAlign: "center" }}>
              Quanto deseja transferir?
            </Typo>
            <View style={styles.currencyRow}>
              <Typo size={28} fontWeight="700" color={Colors.dark.primary}>
                KZ
              </Typo>
              <TextInput
                style={styles.amountInput}
                placeholder="0,00"
                placeholderTextColor="#444"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>
          </View>

          {/* SELEÇÃO DE CARTEIRAS */}
          <View style={styles.selectionContainer}>
            <Typo fontWeight="600" style={{ marginBottom: 15 }}>
              Origem e Destino
            </Typo>

            <View style={styles.walletPickersRow}>
              {/* DE: */}
              <View style={styles.pickerColumn}>
                <Typo size={14} color="#aaa" style={{ marginBottom: 5 }}>
                  Sair de:
                </Typo>
                <ScrollView style={styles.walletList} nestedScrollEnabled>
                  {wallets.map((w) => (
                    <TouchableOpacity
                      key={w.id}
                      style={[
                        styles.walletItem,
                        fromWalletId === w.id && styles.selectedItem,
                      ]}
                      onPress={() => setFromWalletId(w.id as number)}
                    >
                      <Typo
                        size={13}
                        color={fromWalletId === w.id ? "#fff" : "#888"}
                      >
                        {w.name}
                      </Typo>
                      {fromWalletId === w.id && (
                        <CheckCircle size={14} color="#fff" weight="fill" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {fromWallet && (
                  <Typo size={12} color="#34C759" style={{ marginTop: 5 }}>
                    Disp: {fromWallet.amount} KZ
                  </Typo>
                )}
              </View>

              <View style={styles.centerIcon}>
                <ArrowsLeftRight
                  size={20}
                  color={Colors.dark.primary}
                  weight="bold"
                />
              </View>

              {/* PARA: */}
              <View style={styles.pickerColumn}>
                <Typo size={14} color="#aaa" style={{ marginBottom: 5 }}>
                  Enviar para:
                </Typo>
                <ScrollView style={styles.walletList} nestedScrollEnabled>
                  {wallets
                    .filter((w) => w.id !== fromWalletId)
                    .map((w) => (
                      <TouchableOpacity
                        key={w.id}
                        style={[
                          styles.walletItem,
                          toWalletId === w.id && styles.selectedItem,
                          { borderLeftColor: "#f97316" },
                        ]}
                        onPress={() => setToWalletId(w.id as number)}
                      >
                        <Typo
                          size={13}
                          color={toWalletId === w.id ? "#fff" : "#888"}
                        >
                          {w.name}
                        </Typo>
                        {toWalletId === w.id && (
                          <CheckCircle size={14} color="#fff" weight="fill" />
                        )}
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            </View>
          </View>

          {/* AVISO DE SALDO */}
          {fromWallet && parseFloat(amount) > fromWallet.amount! && (
            <View style={styles.warningBox}>
              <Warning size={20} color="#ff3b30" weight="fill" />
              <Typo size={13} color="#ff3b30">
                Saldo insuficiente na carteira de origem.
              </Typo>
            </View>
          )}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (isSubmitting || !fromWalletId || !toWalletId) &&
                  styles.disabledButton,
              ]}
              onPress={handleTransfer}
              disabled={isSubmitting || !fromWalletId || !toWalletId}
            >
              <Typo color="#fff" fontWeight="700" size={18}>
                {isSubmitting ? "Processando..." : "Confirmar Transferência"}
              </Typo>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: scale(20) },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  backButton: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 12,
  },
  scrollContent: { paddingBottom: 100 },
  amountContainer: {
    alignItems: "center",
    marginBottom: verticalScale(40),
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  amountInput: {
    fontSize: scale(40),
    fontWeight: "800",
    color: "#fff",
    minWidth: scale(150),
    textAlign: "center",
  },
  selectionContainer: {
    backgroundColor: "#262626",
    borderRadius: 24,
    padding: scale(20),
    borderWidth: 1,
    borderColor: "#333",
  },
  walletPickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  pickerColumn: { flex: 1 },
  centerIcon: {
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  walletList: {
    maxHeight: verticalScale(150),
  },
  walletItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.primary,
  },
  selectedItem: {
    backgroundColor: "#333",
    borderColor: "#fff",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    padding: 15,
    borderRadius: 15,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  confirmButton: {
    backgroundColor: Colors.dark.primary,
    height: verticalScale(55),
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#444",
    opacity: 0.6,
  },
});
