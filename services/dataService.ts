import * as schema from "@/db/schema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { fetchWithAuth } from "./userService";

export const DataService = {
  // Backup: Envia o estado atual do SQLite para o servidor como um "checkpoint"
  performBackup: async (db: ExpoSQLiteDatabase<typeof schema>) => {
    const allTransactions = await db.query.transactions.findMany();
    const allWallets = await db.query.wallets.findMany();

    const backupData = {
      timestamp: new Date().toISOString(),
      transactions: allTransactions,
      wallets: allWallets,
    };

    return await fetchWithAuth("http://10.0.2.2:3000/api/v1/backup", {
      method: "POST",
      body: JSON.stringify(backupData),
    });
  },

  // Recuperação: Sobrescreve o local com dados do servidor
  restoreData: async (db: ExpoSQLiteDatabase<typeof schema>) => {
    const res = await fetchWithAuth(
      "http://10.0.2.2:3000/api/v1/backup/latest",
    );
    const data = await res.json();

    if (data) {
      // Lógica de inserção em massa (Truncate + Insert)
      // Nota: Cuidado com chaves estrangeiras aqui
      return data;
    }
  },
};
