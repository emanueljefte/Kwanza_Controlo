import * as schema from "@/db/schema";
import NetInfo from "@react-native-community/netinfo";
import { and, desc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';


export default function useFetchData<T>(
  dataBaseName: "wallets" | "users" | "transactions",
  filters: Record<string, string | number | boolean> = {},
  refreshKey: number
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useEffect(() => {
    if (!dataBaseName) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const net = await NetInfo.fetch();
      const isOnline = net.isConnected === true;

      // if (isOnline) {
      //   try {
      //     const token = await AsyncStorage.getItem("token");

      //     const queryParams = new URLSearchParams();
      //     for (const key in filters) {
      //       if (filters[key] !== undefined && filters[key] !== null) {
      //         queryParams.append(key, String(filters[key]));
      //       }
      //     }

      //     const url = `http://10.0.2.2:3000/api/v1/${dataBaseName}?${queryParams.toString()}`;
      //     const res = await fetch(url, {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //         "Content-Type": "application/json",
      //       },
      //     });

      //     const json = await res.json();
      //     setData(json);

      //     // Opcional: salvar no SQLite para uso offline depois
      //     // await drizzleDb.insert(schema[dataBaseName]).values(json).onConflictDoUpdate(...)

      //   } catch (err: any) {
      //     console.error("Erro ao buscar online:", err);
      //     setError(err.message || "Erro desconhecido");
      //     await fetchFromLocal();
      //   } finally {
      //     setLoading(false);
      //   }
      // } else {
        // }
          await fetchFromLocal();
          setLoading(false);
    };

    const fetchFromLocal = async () => {
      try {
        let localData: T[] = [];

        if (dataBaseName === "wallets") {
          const whereClause = filters.uid
            ? and(eq(schema.wallets.user, String(filters.uid)), eq(schema.wallets.marked_to_delete, 0))
            : undefined;

          localData = await drizzleDb
            .select()
            .from(schema.wallets)
            .where(whereClause!)
            .orderBy(desc(schema.wallets.created)) as T[];
        }

        if (dataBaseName === "transactions") {
          const whereClause = filters.uid
            ? and(eq(schema.transactions.user, String(filters.uid)), eq(schema.transactions.marked_to_delete, 0))
            : undefined;

          localData = await drizzleDb
            .select()
            .from(schema.transactions)
            .where(whereClause!)
            .limit(30)
            .orderBy(desc(schema.transactions.date)) as T[];
        }

        // Adicione outros dataBaseName aqui se necessário
        setData(localData);
      } catch (err: any) {
        console.error("Erro ao buscar local:", err);
        setError("Erro ao buscar dados offline");
      }
    };

    fetchData();
  }, [dataBaseName, JSON.stringify(filters), refreshKey]);

  return { data, loading, error };
}