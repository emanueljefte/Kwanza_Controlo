import { db } from "@/db";
import * as schema from "@/db/schema";
import { ResponseType, WalletType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { eq, sql } from "drizzle-orm";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>,
): Promise<ResponseType> => {
  const token = await AsyncStorage.getItem("token");
  const net = await NetInfo.fetch();
  const isOnline = net.isConnected === true;

  try {
    let walletToSave: WalletType = {
      ...walletData,
      amount: walletData.amount ?? 0,
      totalIncome: walletData.totalIncome ?? 0,
      totalExpenses: walletData.totalExpenses ?? 0,
      created: walletData.created ?? new Date().toISOString(),
      is_dirty: isOnline ? 0 : 1,
      user: walletData.user,
    } as WalletType;

    const updateData: any = {
      ...walletData,
      is_dirty: isOnline ? 0 : 1,
    };

    // Removemos campos que não devem ser resetados se vierem vazios no Partial
    if (updateData.amount === undefined) delete updateData.amount;
    if (updateData.totalIncome === undefined) delete updateData.totalIncome;
    if (updateData.totalExpenses === undefined) delete updateData.totalExpenses;

    // Salva ou atualiza localmente
    await db
      .insert(schema.wallets)
      .values(walletToSave as any)
      .onConflictDoUpdate({
        target: schema.wallets.id,
        set: updateData,
      });

    return { success: true, data: walletToSave };
  } catch (error: any) {
    console.log("Erro ao criar ou atualizar carteira: ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: number): Promise<ResponseType> => {
  const token = await AsyncStorage.getItem("token");

  try {
    // Marca como "deletar depois"
    await db
      .update(schema.wallets)
      .set({ is_dirty: 1, marked_to_delete: 1 })
      .where(eq(schema.wallets.id, walletId));

    deleteTransactionsByWalletId(walletId);

    return { success: true, msg: "Carteira marcada para exclusão offline" };
    // }
  } catch (error: any) {
    console.log("Erro ao deletar carteira", error);
    return { success: false, msg: error.message };
  }
};

export const deleteTransactionsByWalletId = async (
  walletId: number,
): Promise<ResponseType> => {
  try {
    await db
      .update(schema.transactions)
      .set({
        is_dirty: 1,
        marked_to_delete: 1,
      })
      .where(eq(schema.transactions.walletId, walletId));

    return { success: true };
  } catch (error: any) {
    console.log("Erro ao deletar carteira", error);
    return { success: false, msg: error.message };
  }
};

export const WalletsTransfer = async (
  value: number,
  fromId: number,
  toId: number,
  user: string,
  fromName: string,
  toName: string,
) => {
  await db.transaction(async (tx) => {
    // 1. Deduzir o valor da carteira de ORIGEM
    await tx
      .update(schema.wallets)
      .set({
        amount: sql`${schema.wallets.amount} - ${value}`,
        // Opcional: podes querer trackear isto como uma "despesa" técnica para os gráficos
        totalExpenses: sql`${schema.wallets.totalExpenses} + ${value}`,
      })
      .where(eq(schema.wallets.id, fromId));

    // 2. Adicionar o valor à carteira de DESTINO
    await tx
      .update(schema.wallets)
      .set({
        amount: sql`${schema.wallets.amount} + ${value}`,
        totalIncome: sql`${schema.wallets.totalIncome} + ${value}`,
      })
      .where(eq(schema.wallets.id, toId));

    // 3. Criar um registo no histórico de transações
    // Recomendo criar dois registos ou um registo especial de "transfer"
    await tx.insert(schema.transactions).values({
      user: user as string,
      amount: value,
      type: "expense", // Saiu dinheiro desta perspetiva
      category: "Transferência",
      walletId: fromId,
      description: `Transferência para ${toName}`,
      date: new Date().toISOString(),
    });

    await tx.insert(schema.transactions).values({
      user: user as string,
      amount: value,
      type: "income", // Entrou dinheiro nesta perspetiva
      category: "Transferência",
      walletId: toId,
      description: `Recebido de ${fromName}`,
      date: new Date().toISOString(),
    });
  });
};
