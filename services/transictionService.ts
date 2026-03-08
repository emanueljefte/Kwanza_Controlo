import { getRandomColor } from "@/constants/icons";
import * as schema from "@/db/schema";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { getLast12Months, getLast7Days, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { and, desc, eq, sql } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { createOrUpdateWallet } from "./walletService";

export const createOrUpdateTransaction = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  transactionData: Partial<TransactionType>,
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Dados da transação inválidas" };
    }

    if (id) {
      const [oldTransaction] = await db
        .select()
        .from(schema.transactions)
        .where(eq(schema.transactions.id, id));
      const shouldRevertOriginal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        Number(oldTransaction.walletId) != walletId;
      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallets(
          db,
          oldTransaction as any,
          Number(amount),
          type,
          walletId,
        );
        if (!res.success) return res;
      }
    } else {
      let res = await updateWalletForNewTransaction(
        db,
        walletId!,
        Number(amount!),
        type,
      );
      if (!res.success) return res;
    }

    const transactionRes = await db
      .insert(schema.transactions)
      .values(transactionData as any)
      .onConflictDoUpdate({
        target: schema.transactions.id,
        set: transactionData as any,
      });

    return {
      success: true,
      data: { ...transactionData, id: transactionRes.lastInsertRowId },
    };
  } catch (error: any) {
    console.log("Erro ao criar e actualizar transação: ", error);
    return { success: false, msg: error.message };
  }
};

const updateWalletForNewTransaction = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  walletId: number,
  amount: number,
  type: string,
): Promise<ResponseType> => {
  let token = await AsyncStorage.getItem("token");
  try {
    const [walletRef] = await db
      .select()
      .from(schema.wallets)
      .where(eq(schema.wallets.id, walletId));

    if (!walletRef.id) {
      console.log("Erro ao actualizar a carteira para novas transações");
      return { success: false, msg: "Carteira não encontrada" };
    }

    const walletData = walletRef as WalletType;

    if (type == "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Selecionada Carteira sem dinheiro o suficiente",
      };
    }

    const updateType = type == "income" ? "totalIncome" : "totalExpenses";
    const updateWalletAmount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type == "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await db
      .update(schema.wallets)
      .set({
        amount: updateWalletAmount,
        [updateType]: updatedTotals,
        is_dirty: 1,
      })
      .where(eq(schema.wallets.id, walletId));
    return { success: true };
  } catch (error: any) {
    console.log("Erro ao actualizar a carteira pela nova transação: ", error);
    return { success: false, msg: error.message };
  }
};

const revertAndUpdateWallets = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: number,
): Promise<ResponseType> => {
  try {
    const [originalWallet] = await db
      .select()
      .from(schema.wallets)
      .where(eq(schema.wallets.id, oldTransaction.walletId));

    let [newWallet] = await db
      .select()
      .from(schema.wallets)
      .where(eq(schema.wallets.id, newWalletId));

    const revertType =
      oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type == "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense;

    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType == "expense") {
      if (
        oldTransaction.walletId == newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "A Carteira selecionada não tem saldo o suficiente",
        };
      }

      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: "A Carteira selecionada não tem saldo o suficiente",
        };
      }
    }

    await createOrUpdateWallet(db, {
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    ////////////////////////////////////////////////////////////////////

    const [newWalletSnap] = await db
      .select()
      .from(schema.wallets)
      .where(eq(schema.wallets.id, newWalletId));

    newWallet = newWalletSnap;

    const updateType =
      newTransactionType == "income" ? "totalIncome" : "totalExpenses";

    const updatedTransactionAmount: number =
      newTransactionType == "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

    const newIncomeExpenseAmount =
      Number(newWallet[updateType]!) + Number(newTransactionAmount);

    await createOrUpdateWallet(db, {
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    return { success: true };
  } catch (error: any) {
    console.log("Erro ao actualizar a carteira pela nova transação: ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteTransaction = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  transactionId: number,
  walletId: number,
): Promise<ResponseType> => {
  const token = await AsyncStorage.getItem("token");
  const net = await NetInfo.fetch();
  const isOnline = net.isConnected === true;

  try {
    if (isOnline) {
      const res = await fetch(
        `http://10.0.2.2:3000/api/v1/wallets/${walletId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          msg: data.msg || "Falha no delete da carteira",
        };
      }

      // Deleta localmente
      await db.delete(schema.wallets).where(eq(schema.wallets.id, walletId));

      return { success: true, msg: "Carteira deletada com sucesso" };
    } else {
      // Marca como "deletar depois"
      const [transactionData] = await db
        .select()
        .from(schema.transactions)
        .where(eq(schema.transactions.id, transactionId));

      if (!transactionData.id) {
        return { success: false, msg: "Transação não encontrada" };
      }

      const transactionType = transactionData?.type;
      const transactionAmount = transactionData?.amount;

      const [walletData] = await db
        .select()
        .from(schema.wallets)
        .where(eq(schema.wallets.id, walletId));

      const updateType =
        transactionType == "income" ? "totalIncome" : "totalExpenses";

      const newWalletAmount =
        walletData?.amount! -
        (transactionType == "income"
          ? transactionAmount!
          : -transactionAmount!);

      const newIncomeExpenseAmount =
        walletData[updateType]! - transactionAmount!;

      if (transactionType == "expense" && newWalletAmount < 0) {
        return { success: false, msg: "Você não pode deletar esta transação" };
      }

      await createOrUpdateWallet(db, {
        id: walletId,
        amount: newWalletAmount,
        [updateType]: newIncomeExpenseAmount,
      });

      await db
        .update(schema.transactions)
        .set({ is_dirty: 1, marked_to_delete: 1 })
        .where(eq(schema.transactions.id, transactionId));

      return { success: true, msg: "Transação marcada para exclusão offline" };
    }
  } catch (error: any) {
    console.log("Erro ao deletar transação", error);
    return { success: false, msg: error.message };
  }
};

export const fetchWeeklyStats = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  uid: string,
): Promise<ResponseType> => {
  try {
    const today = new Date();
    const sevenDayAgo = new Date(today);
    sevenDayAgo.setDate(today.getDate() - 7);
    sevenDayAgo.setHours(0, 0, 0, 0)
    today.setHours(23, 59, 59, 999)

    const transationsQuery = await db
      .select()
      .from(schema.transactions)
      .where(
        and(
          sql`date(${schema.transactions.date}) >= date(${sevenDayAgo.toISOString()})`,
          sql`date(${schema.transactions.date}) <= date(${today.toISOString()})`,
          eq(schema.transactions.user, uid),
        ),
      )
      .orderBy(desc(schema.transactions.date));

    const weeklyData = getLast7Days();
    const transactions: TransactionType[] = [];
    const categoryTotals: { [key: string]: number } = {}; // Para o gráfico de Pizza

    transationsQuery.forEach((doc) => {
      const transaction = doc as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as string)
        .toString()
        .split("T")[0];

      const dayData = weeklyData.find((day) => day.date == transactionDate);

      if (dayData) {
        if (transaction.type == "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type == "expense") {
          dayData.expense += transaction.amount;
        }
      }

      // Lógica para Pizza (Apenas Despesas por Categoria)
      if (transaction.type === "expense") {
        categoryTotals[transaction.category!] =
          (categoryTotals[transaction.category!] || 0) + transaction.amount;
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: "#2f4",
      },
      { value: day.expense, frontColor: "rgb(244, 36, 71)" },
    ]);

    // Formatação para PieChart
    const pieData = Object.keys(categoryTotals).map((cat) => ({
      value: categoryTotals[cat],
      text: cat,
      color: getRandomColor(cat),
    }));

    return { success: true, data: { stats, transactions, pieData } };
  } catch (error: any) {
    console.log("Erro ao carregar as transações semanais", error);
    return { success: false, msg: "Erro ao carregar as transações semanais" };
  }
};

export const fetchMonthlyStats = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  uid: string,
): Promise<ResponseType> => {
  try {
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 12);
    twelveMonthsAgo.setHours(0, 0, 0, 0)
    today.setHours(23, 59, 59, 999)

    const transationsQuery = await db
      .select()
      .from(schema.transactions)
      .where(
        and(
          sql`date(${schema.transactions.date}) >= date(${twelveMonthsAgo.toISOString()})`,
          sql`date(${schema.transactions.date}) <= date(${today.toISOString()})`,
          eq(schema.transactions.user, uid),
        ),
      )
      .orderBy(desc(schema.transactions.date));

    const monthlyData = getLast12Months();
    const transactions: TransactionType[] = [];
    const categoryTotals: { [key: string]: number } = {}; // Faltava isso

    transationsQuery.forEach((doc) => {
      const transaction = doc as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = new Date(transaction.date);
      const monthName = transactionDate.toLocaleString("default", {
        month: "short",
      });
      const shortYear = transactionDate.getFullYear().toString().slice(-2);
      const monthData = monthlyData.find(
        (month) => month.month === `${monthName} ${shortYear}`,
      );

      if (monthData) {
        if (transaction.type == "income")
          monthData.income += transaction.amount;
        else if (transaction.type == "expense")
          monthData.expense += transaction.amount;
      }

      // Lógica para Pizza
      if (transaction.type === "expense") {
        categoryTotals[transaction.category!] =
          (categoryTotals[transaction.category!] || 0) + transaction.amount;
      }
    });

    const stats = monthlyData.flatMap((month) => [
      {
        value: month.income,
        label: month.month,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: "#2f4",
      },
      { value: month.expense, frontColor: "rgb(244, 36, 71)" },
    ]);

    const pieData = Object.keys(categoryTotals).map((cat) => ({
      value: categoryTotals[cat],
      label: cat,
      color: getRandomColor(cat),
    }));

    return { success: true, data: { stats, transactions, pieData } }; // Adicionado pieData
  } catch (error: any) {
    return { success: false, msg: "Erro ao carregar as transações mensais" };
  }
};

export const fetchYearlyStats = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  uid: string,
): Promise<ResponseType> => {
  try {
    const transationsQuery = await db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.user, uid))
      .orderBy(desc(schema.transactions.date));

    const transactions: TransactionType[] = [];
    const categoryTotals: { [key: string]: number } = {};

    // ... lógica do firstYear e yearlyDate permanece igual ...
    const firstTransaction = transationsQuery.reduce((earliest, doc) => {
      const d = new Date(doc.date as string);
      return d < earliest ? d : earliest;
    }, new Date());
    const yearlyDate = getYearsRange(
      firstTransaction.getFullYear(),
      new Date().getFullYear(),
    );

    transationsQuery.forEach((doc) => {
      const transaction = doc as TransactionType;
      transactions.push(transaction);

      const transactionYear = new Date(transaction.date).getFullYear();
      const yearData = yearlyDate.find(
        (item: any) => item.year === transactionYear.toString(),
      );

      if (yearData) {
        if (transaction.type == "income") yearData.income += transaction.amount;
        else if (transaction.type == "expense")
          yearData.expense += transaction.amount;
      }

      if (transaction.type === "expense") {
        categoryTotals[transaction.category!] =
          (categoryTotals[transaction.category!] || 0) + transaction.amount;
      }
    });

    const stats = yearlyDate.flatMap((year: any) => [
      {
        value: year.income,
        label: year.year,
        spacing: scale(4),
        frontColor: "#2f4",
      },
      { value: year.expense, frontColor: "rgb(244, 36, 71)" },
    ]);

    const pieData = Object.keys(categoryTotals).map((cat) => ({
      value: categoryTotals[cat],
      label: cat,
      color: getRandomColor(cat),
    }));

    return { success: true, data: { stats, transactions, pieData } };
  } catch (error: any) {
    return { success: false, msg: "Erro ao carregar as transações anuais" };
  }
};
