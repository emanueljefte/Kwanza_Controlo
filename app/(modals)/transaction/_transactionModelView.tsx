import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";

import { transactionType } from "@/constants/icons";
import { useTheme } from "@/contexts/ThemeContext";
import { TransactionType, WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import * as Icons from "phosphor-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type TransactionModelViewProps = {
  old: {
    type: string;
    amount: string;
    category?: string;
    date: string;
    description?: string;
    user?: string;
    walletId: string;
    image?: any;
    id: string;
  };
  transaction: TransactionType;
  wallets: WalletType[];
  showDatePicker: boolean;
  loading: boolean;
  walletLoading: boolean;
  showDeleteAlert: () => void;
  getCategoryIcon: (category: string, type: string) => any;
  setShowDatePicker: (value: boolean) => void;
  setTransaction: (value: TransactionType) => void;
  onDateChange: (event: DateTimePickerEvent, selectedDate: Date) => void;
  onSubmit: () => void;
};

export default function TransactionModelView({
  loading,
  walletLoading,
  old,
  transaction,
  wallets,
  showDatePicker,
  showDeleteAlert,
  getCategoryIcon,
  setTransaction,
  setShowDatePicker,
  onDateChange,
  onSubmit,
}: TransactionModelViewProps) {
  const { theme } = useTheme();

  const isExpense = transaction.type === "expense";
  const accentColor = isExpense ? "#ef4444" : "#10b981";
  return (
    <>
      <View style={styles.container}>
        <Header
          title={old?.id ? "Editar Registro" : "Novo Registro"}
          leftIcon={<BackButton />}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* SEÇÃO 1: MONTANTE EM DESTAQUE */}
            <View style={styles.amountSection}>
              <Typo size={14} color="#888" style={{ textAlign: "center" }}>
                Quanto?
              </Typo>
              <View style={styles.amountInputWrapper}>
                <Typo size={32} fontWeight="700" color={accentColor}>
                  KZ
                </Typo>
                <Input
                  keyboardType="numeric"
                  value={transaction?.amount.toString()}
                  style={[styles.hugeInput, { color: accentColor }]}
                  onChangeText={(value) =>
                    setTransaction({
                      ...transaction,
                      amount: Number(value.replace(/[^0-9]/g, "")),
                    })
                  }
                />
              </View>
            </View>

            {/* SEÇÃO 2: TIPO E CONTA */}
            <View style={styles.row}>
              <View style={{ flex: 1, gap: 8 }}>
                <Typo size={15} fontWeight="600">
                  Tipo
                </Typo>
                <Dropdown
                  containerStyle={[
                    styles.dropdownListContainer,
                    {
                      backgroundColor: theme.background,
                    },
                  ]}
                  style={[
                    styles.dropdownContainer,
                    { borderColor: accentColor },
                  ]}
                  data={transactionType}
                  labelField={"label"}
                  valueField={"value"}
                  value={transaction.type}
                  onChange={(item) =>
                    setTransaction({ ...transaction, type: item.value })
                  }
                  itemTextStyle={{
                    color: theme.title,
                  }}
                  selectedTextStyle={{ color: accentColor, fontWeight: "bold" }}
                  activeColor={Colors.dark.primary + "40"}
                />
              </View>

              <View style={{ flex: 1, gap: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typo size={15} fontWeight="600">
                    Carteira
                  </Typo>
                  {!wallets?.length && (
                    <TouchableOpacity
                      onPress={() => router.push("/(modals)/wallet")}
                    >
                      <Typo
                        size={12}
                        color={Colors.dark.primary}
                        fontWeight="700"
                      >
                        + Criar
                      </Typo>
                    </TouchableOpacity>
                  )}
                </View>
                <Dropdown
                  containerStyle={[
                    styles.dropdownListContainer,
                    {
                      backgroundColor: theme.background,
                    },
                  ]}
                  itemTextStyle={{
                    color: theme.title,
                  }}
                  style={[
                    styles.dropdownContainer,
                    !wallets?.length && { opacity: 0.6, borderColor: "#666" },
                  ]}
                  // Se não houver carteiras, mostramos uma lista com um aviso
                  data={
                    !wallets || wallets.length === 0
                      ? [{ label: "Nenhuma carteira encontrada", value: null }]
                      : wallets.map((w) => ({
                          label: `${w.name} (${w.amount} KZ)`,
                          value: w.id,
                        }))
                  }
                  labelField={"label"}
                  valueField={"value"}
                  value={transaction.walletId}
                  disable={!wallets || wallets.length === 0} // Impede o clique se estiver vazio
                  placeholder={
                    !wallets?.length
                      ? "Crie uma carteira primeiro"
                      : "Selecionar"
                  }
                  placeholderStyle={{
                    color: !wallets?.length ? "#ef4444" : "#888",
                    fontSize: 14,
                  }}
                  onChange={(item) => {
                    if (item.value) {
                      setTransaction({ ...transaction, walletId: item.value });
                    }
                  }}
                  selectedTextStyle={{
                    color: theme.title,
                    fontWeight: "bold",
                  }}
                  activeColor={Colors.dark.primary + "40"}
                />

                {/* FEEDBACK VISUAL EXTRA */}
                {!wallets?.length && (
                  <Typo size={12} color="#ef4444" style={{ marginTop: 2 }}>
                    * Precisas de uma carteira para registar
                  </Typo>
                )}
              </View>
            </View>

            {/* SEÇÃO 3: CATEGORIA E DATA */}
            <View style={styles.cardSection}>
              {/* CATEGORIA DINÂMICA COM ÍCONE DO CATÁLOGO */}
              <TouchableOpacity
                style={styles.listRow}
                onPress={() =>
                  router.push({
                    pathname: "/(modals)/category",
                    params: { type: transaction.type },
                  })
                }
              >
                {/* 1. Chamamos a função e guardamos o componente em 'CategoryIcon' */}
                {(() => {
                  const CategoryIcon = getCategoryIcon(
                    transaction.category!,
                    transaction.type,
                  );

                  // Definimos a cor baseada no tipo ou se já foi selecionado
                  const iconColor = transaction.category
                    ? transaction.type === "income"
                      ? "#10b981"
                      : Colors.dark.primary
                    : "#666";

                  return (
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: iconColor + "15" },
                      ]}
                    >
                      {/* 2. Renderizamos como um componente normal */}
                      <CategoryIcon size={22} weight="fill" color={iconColor} />
                    </View>
                  );
                })()}

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Typo size={12} color="#888">
                    Categoria de{" "}
                    {transaction.type === "income" ? "Renda" : "Despesa"}
                  </Typo>
                  <Typo
                    size={16}
                    fontWeight={transaction.category ? "600" : "400"}
                  >
                    {transaction.category || "Escolher categoria"}
                  </Typo>
                </View>

                <Icons.CaretRightIcon size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.listRow, { borderBottomWidth: 0 }]}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.iconCircle}>
                  <Icons.CalendarBlankIcon
                    size={22}
                    color={Colors.dark.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Typo size={14} color="#888">
                    Quando aconteceu?
                  </Typo>
                  <Typo size={16} fontWeight="500">
                    {(transaction.date as Date).toLocaleDateString("pt-AO")}
                  </Typo>
                </View>
              </TouchableOpacity>
            </View>

            {/* SEÇÃO 4: DETALHES ADICIONAIS */}
            <View style={{ gap: 15 }}>
              <Typo size={15} fontWeight="600">
                Mais informações
              </Typo>
              <Input
                placeholder="Descrição (ex: Almoço com a família)"
                multiline
                value={transaction?.description}
                containerStyle={styles.textArea}
                onChangeText={(value) =>
                  setTransaction({ ...transaction, description: value })
                }
              />

              <ImageUpload
                file={transaction.image}
                onSelect={(file) =>
                  setTransaction({ ...transaction, image: file })
                }
                onClear={() => setTransaction({ ...transaction, image: null })}
                placeholder="Anexar Recibo"
              />
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={transaction.date as Date}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={onDateChange as any}
              />
            )}
            <View style={styles.footer}>
              {old?.id && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={showDeleteAlert}
                >
                  <Icons.TrashIcon size={24} color="#fff" weight="bold" />
                </TouchableOpacity>
              )}
              <Button
                onPress={onSubmit}
                loading={loading}
                disabled={loading || walletLoading}
                style={{
                  flex: 1,
                  height: verticalScale(55),
                  borderRadius: 16,
                  backgroundColor: accentColor,
                }}
              >
                <Typo fontWeight={"700"} color="#fff" size={18}>
                  {old?.id ? "Salvar Alterações" : "Confirmar Lançamento"}
                </Typo>
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: scale(20) },
  scrollContent: { paddingBottom: verticalScale(40), gap: verticalScale(25) },
  amountSection: {
    alignItems: "center",
    paddingVertical: verticalScale(10),
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hugeInput: {
    borderWidth: 0,
    backgroundColor: "transparent",
    minWidth: scale(50),
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  row: { flexDirection: "row", gap: 15 },

  dropdownContainer: {
    height: verticalScale(50),
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#333",
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  cardSection: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 5,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownListContainer: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  textArea: {
    height: verticalScale(80),
    alignItems: "flex-start",
    paddingTop: 12,
    borderRadius: 15,
  },

  footer: {
    flexDirection: "row",
    padding: scale(20),
  },
  deleteBtn: {
    width: verticalScale(55),
    height: verticalScale(55),
    backgroundColor: Colors.dark.warning,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
