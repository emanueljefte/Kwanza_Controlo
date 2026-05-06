import CustomAlert from "@/components/CustomAlert";
import ModalWrapper from "@/components/ModalWrapper";

import { ICON_CATALOG, INCOME_CATALOG } from "@/constants/icons";
import { useAuth } from "@/contexts/AuthProvider";
import useFetchData from "@/hooks/useFetchData";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/services/transictionService";
import { TransactionType, WalletType } from "@/types";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as Icons from "phosphor-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import TransactionModelView from "./_transactionModelView";

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

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };

  const isInitialized = useRef(false);

  useEffect(() => {
    async function initializeTransaction() {
      // 1. Tenta ler se o usuário acabou de escolher algo no Modal
      const dados = await SecureStore.getItemAsync("category");

      if (dados) {
        // Se existem dados no SecureStore, o usuário acabou de vir do modal
        // Independente de ser edição ou nova, a escolha do modal tem prioridade
        const parsed = JSON.parse(dados);
        setTransaction((prev) => ({ ...prev, category: parsed.displayName }));

        // Limpamos para que, se ele sair e voltar à tela, não use o valor "sujo"
        await SecureStore.deleteItemAsync("category");

        // Se viemos do modal, não precisamos rodar a lógica de inicialização abaixo
        isInitialized.current = true;
        return;
      }

      // 2. Se não veio do modal e ainda não foi inicializado (Primeira abertura da tela)
      if (!isInitialized.current) {
        if (oldTransaction?.id) {
          // EDIÇÃO: Popula com dados vindos da listagem
          setTransaction({
            type: (oldTransaction.type as any) || "expense",
            amount: Number(oldTransaction.amount),
            category: oldTransaction.category || "",
            date: new Date(oldTransaction.date),
            description: oldTransaction.description || "",
            image: oldTransaction.image,
            user: oldTransaction.user,
            walletId: Number(oldTransaction.walletId),
          });
        } else {
          // NOVA TRANSAÇÃO: Valores padrão
          setTransaction((prev) => ({
            ...prev,
            category: prev.type === "income" ? "Salário" : "Casa",
          }));
        }
        isInitialized.current = true;
      }
    }

    initializeTransaction();
  }, [oldTransaction.id, refreshKey]);

  useEffect(() => {
    isInitialized.current = false;
  }, [oldTransaction.id]);

  useEffect(() => {
    // Se ainda não temos categoria (ex: durante o carregamento), não fazemos o reset
    if (!transaction.category) return;

    const catalog =
      transaction.type === "income" ? INCOME_CATALOG : ICON_CATALOG;
    const allItems = Object.values(catalog).flat() as any[];
    const exists = allItems.find((i) => i.displayName === transaction.category);

    console.log("Procurando por:", transaction.category);
    console.log(
      "Lista disponível:",
      allItems.map((i) => i.displayName),
    );
    if (!exists) {
      setTransaction((prev) => ({
        ...prev,
        category: transaction.type === "income" ? "Salário" : "Outros",
      }));
    }
  }, [transaction.type]);

  const handleSubmit = async () => {
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

    if (oldTransaction?.id) {
      transactionData.id = Number(oldTransaction.id);
      // transactionData.category = oldTransaction.category;
    }

    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);
    setLoading(false);
    if (res.success) {
      router.replace("/(tabs)");
    } else {
      showAlert("transação", res.msg as string);
    }
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteTransaction(
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
      <TransactionModelView
        old={oldTransaction}
        loading={loading}
        walletLoading={walletLoading}
        wallets={wallets}
        transaction={transaction}
        showDeleteAlert={showDeleteAlert}
        showDatePicker={showDatePicker}
        getCategoryIcon={getCategoryIcon}
        setShowDatePicker={setShowDatePicker}
        setTransaction={setTransaction}
        onSubmit={handleSubmit}
        onDateChange={handleDateChange}
      />
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
