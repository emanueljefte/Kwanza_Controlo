import * as schema from "@/db/schema";
import { ResponseType, WalletType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { eq } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

export const createOrUpdateWallet = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  walletData: Partial<WalletType>
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
      user: walletData.user
    } as WalletType;

    // if (isOnline) {
    //   const fetchData = walletData?.id
    //     ? {
    //       url: `http://10.0.2.2:3000/api/v1/wallets/${walletData.id}`,
    //       method: "PUT",
    //     }
    //     : {
    //       url: "http://10.0.2.2:3000/api/v1/wallets/",
    //       method: "POST",
    //     };

    //   const res = await fetch(fetchData.url, {
    //     method: fetchData.method,
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(walletToSave),
    //   });

    //   const data = await res.json();
    //   if (!res.ok) {
    //     return {
    //       success: false,
    //       msg: data.msg || "Falha no upload da carteira",
    //     };
    //   }

    //   walletToSave = data.wallet;
    //   walletToSave.is_dirty = 0;
    // }

    // Salva ou atualiza localmente
    await db
      .insert(schema.wallets)
      .values(walletToSave as any)
      .onConflictDoUpdate({
        target: schema.wallets.id,
        set: walletToSave as any,
      });

    return { success: true, data: walletToSave };
  } catch (error: any) {
    console.log("Erro ao criar ou atualizar carteira: ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  walletId: number
): Promise<ResponseType> => {
  const token = await AsyncStorage.getItem("token");
  const net = await NetInfo.fetch();
  const isOnline = net.isConnected === true;

  try {
    // if (isOnline) {
    //   const res = await fetch(`http://10.0.2.2:3000/api/v1/wallets/${walletId}`, {
    //     method: "DELETE",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   const data = await res.json();
    //   if (!res.ok) {
    //     return {
    //       success: false,
    //       msg: data.msg || "Falha no delete da carteira",
    //     };
    //   }

    //   // Deleta localmente
    //   await db
    //     .delete(schema.wallets)
    //     .where(eq(schema.wallets.id, walletId));

        
    //     return { success: true, msg: "Carteira deletada com sucesso" };
    //   } else {

        // Marca como "deletar depois"
        await db
        .update(schema.wallets)
        .set({ is_dirty: 1, marked_to_delete: 1 })
        .where(eq(schema.wallets.id, walletId));
        
        deleteTransactionsByWalletId(db, walletId)
        
      return { success: true, msg: "Carteira marcada para exclusão offline" };
    // }
  } catch (error: any) {
    console.log("Erro ao deletar carteira", error);
    return { success: false, msg: error.message };
  }
};

export const deleteTransactionsByWalletId = async (db: ExpoSQLiteDatabase<typeof schema>, walletId: number): Promise<ResponseType> => {
  try {
    await db
      .update(schema.transactions)
      .set({
        is_dirty: 1,
        marked_to_delete: 1,
      })
      .where(eq(schema.transactions.walletId, walletId));


      return {success: true}

  } catch (error: any) {
    console.log("Erro ao deletar carteira", error);
    return { success: false, msg: error.message };
  }
}