import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import CustomAlert from "@/components/CustomAlert";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";

import {
  ICON_CATALOG,
  INCOME_CATALOG,
  transactionType,
} from "@/constants/icons";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeContext";
import * as schema from "@/db/schema";
import useFetchData from "@/hooks/useFetchData";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/services/transictionService";
import { TransactionType, WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useSQLiteContext } from "expo-sqlite";
import * as Icons from "phosphor-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function TransactionModel() {
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: 0,
    image: null,
  });
  const { theme } = useTheme();
  const activeColors = Colors[theme!];
  const isExpense = transaction.type === "expense";
  const accentColor = isExpense ? "#ef4444" : "#10b981";
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );
  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "error",
  ) => {
    setAlertConfig({ visible: true, title, message, type });
  };
  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>(
    "wallets",
    { uid: user?.uid as string, orderBy: "created", sort: "desc" },
    refreshKey,
  );

  const oldTransaction: {
    type: string;
    amount: string;
    category?: string;
    date: string;
    description?: string;
    user?: string;
    walletId: string;
    image?: any;
    id: string;
  } = useLocalSearchParams();

  const onDateChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };
  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction?.amount),
        category: oldTransaction?.category || "",
        date: new Date(oldTransaction?.date),
        description: oldTransaction?.description || "",
        image: oldTransaction?.image,
        user: oldTransaction?.user,
        walletId: Number(oldTransaction?.walletId),
      });
    }
    SecureStore.deleteItemAsync("category");
  }, []);

  useEffect(() => {
    async function searchCategory() {
      const dados = await SecureStore.getItemAsync("category");
      if (dados) {
        const parsed = JSON.parse(dados);
        // Aqui garantimos que o nome exibido é o 'displayName' vindo do modal de categorias
        setTransaction((prev) => ({ ...prev, category: parsed.displayName }));
      } else if (!oldTransaction.category) {
        // Se for uma nova transação e não houver nada no Store,
        // definimos o padrão baseado no catálogo
        setTransaction((prev) => ({
          ...prev,
          category: prev.type === "income" ? "Salário" : "Casa",
        }));
      }
    }
    searchCategory();
  }, [refreshKey]);

  useEffect(() => {
    // Se o tipo mudar e a categoria atual não pertencer ao catálogo do novo tipo, resetamos
    const catalog =
      transaction.type === "income" ? INCOME_CATALOG : ICON_CATALOG;
    const allItems = Object.values(catalog).flat() as any[];
    const exists = allItems.find((i) => i.displayName === transaction.category);

    if (!exists) {
      setTransaction((prev) => ({
        ...prev,
        category: prev.type === "income" ? "Salário" : "Outros",
      }));
    }
  }, [transaction.type]);

  const onSubmit = async () => {
    let { type, amount, description, category, date, walletId, image } =
      transaction;

    if (!walletId || !date || !amount || (type == "expense" && !category)) {
      showAlert("Transação", "Por favor Preencha todos os campos");
      return;
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999); // Define para o final do dia atual

    if (new Date(date) > today) {
      showAlert(
        "Data Inválida",
        "Não podes registar uma transação para o futuro!",
      );
      return;
    }

    const transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date:
        typeof transaction.date === "string"
          ? transaction.date
          : transaction.date.toISOString(),
      walletId,
      image: image ? image : null,
      user: user?.uid,
    };

    if (oldTransaction?.id) transactionData.id = Number(oldTransaction.id);
    setLoading(true);
    const res = await createOrUpdateTransaction(drizzleDb, transactionData);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      showAlert("transaction", res.msg as string);
    }
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteTransaction(
      drizzleDb,
      Number(oldTransaction?.id),
      Number(oldTransaction.walletId),
    );
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      showAlert("transação", res.msg as string);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirmação",
      "Tens ceteza que pretendes eliminar esta transação?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Deletar cancelado"),
          style: "cancel",
        },
        {
          text: "Deletar",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ],
    );
  };

  const getCategoryIcon = (categoryName: string | undefined, type: string) => {
    // 1. Seleciona o catálogo
    const catalog = type === "income" ? INCOME_CATALOG : ICON_CATALOG;

    if (!categoryName)
      return type === "income" ? Icons.TrendUpIcon : Icons.TagIcon;

    // 2. Extrai todos os itens de todas as seções num único array plano
    // Usamos 'any' aqui apenas para o flatten, para evitar o conflito de chaves do TS
    const allItems = Object.values(catalog).flat() as any[];

    // 3. Procura o item pelo displayName
    const categoryItem = allItems.find(
      (item) => item.displayName === categoryName,
    );

    // 4. Retorna o componente ou o fallback
    return (
      categoryItem?.comp ||
      (type === "income" ? Icons.TrendUpIcon : Icons.TagIcon)
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Editar Registro" : "Novo Registro"}
          leftIcon={<BackButton />}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
                containerStyle={styles.hugeInput}
                style={{ fontSize: 30, fontWeight: "700", color: accentColor }}
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
                    backgroundColor: activeColors.background,
                  },
                ]}
                style={[styles.dropdownContainer, { borderColor: accentColor }]}
                data={transactionType}
                labelField={"label"}
                valueField={"value"}
                value={transaction.type}
                onChange={(item) =>
                  setTransaction({ ...transaction, type: item.value })
                }
                itemTextStyle={{
                  color: activeColors.title,
                }}
                selectedTextStyle={{ color: accentColor, fontWeight: "bold" }}
                activeColor={Colors.primary + "40"}
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
                    onPress={() => router.push("/(modals)/walletModal")}
                  >
                    <Typo size={12} color={Colors.primary} fontWeight="700">
                      + Criar
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
              <Dropdown
                containerStyle={[
                  styles.dropdownListContainer,
                  {
                    backgroundColor: activeColors.background,
                  },
                ]}
                itemTextStyle={{
                  color: activeColors.title,
                }}
                style={[
                  styles.dropdownContainer,
                  !wallets?.length && { opacity: 0.6, borderColor: "#666" }, // Estilo visual de desabilitado
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
                  !wallets?.length ? "Crie uma carteira primeiro" : "Selecionar"
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
                  color: activeColors.title,
                  fontWeight: "bold",
                }}
                activeColor={Colors.primary + "40"}
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
                  pathname: "/(modals)/categoryModal",
                  params: { type: transaction.type },
                })
              }
            >
              {/* 1. Chamamos a função e guardamos o componente em 'CategoryIcon' */}
              {(() => {
                const CategoryIcon = getCategoryIcon(
                  transaction.category,
                  transaction.type,
                );

                // Definimos a cor baseada no tipo ou se já foi selecionado
                const iconColor = transaction.category
                  ? transaction.type === "income"
                    ? "#10b981"
                    : Colors.primary
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
                <Icons.CalendarBlankIcon size={22} color={Colors.primary} />
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
        </ScrollView>
      </View>

      {/* FOOTER FIXO */}
      <View style={styles.footer}>
        {oldTransaction?.id && (
          <TouchableOpacity style={styles.deleteBtn} onPress={showDeleteAlert}>
            <Icons.Trash size={24} color="#fff" weight="bold" />
          </TouchableOpacity>
        )}
        <Button
          onPress={onSubmit}
          loading={loading}
          style={{
            flex: 1,
            height: verticalScale(55),
            borderRadius: 16,
            backgroundColor: accentColor,
          }}
        >
          <Typo fontWeight={"700"} color="#fff" size={18}>
            {oldTransaction?.id ? "Salvar Alterações" : "Confirmar Lançamento"}
          </Typo>
        </Button>
      </View>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: scale(20) },
  scrollContent: { paddingBottom: verticalScale(100), gap: verticalScale(25) },

  // Amount Header
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
    minWidth: scale(150),
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

  // Estilo Card para Categoria/Data
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
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#000", // Ou cor do tema
  },
  deleteBtn: {
    width: verticalScale(55),
    height: verticalScale(55),
    backgroundColor: Colors.warning,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
