import { db } from "@/db";
import * as schema from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";

export default function useFetchData<T>(
  dataBaseName: "wallets" | "users" | "transactions",
  filters: Record<string, string | number | boolean> = {},
  refreshKey?: number,
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dataBaseName) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      await fetchFromLocal();
      setLoading(false);
    };

    const fetchFromLocal = async () => {
      try {
        let localData: T[] = [];

        if (dataBaseName === "wallets") {
          const whereClause = filters.uid
            ? and(
                eq(schema.wallets.user, String(filters.uid)),
                eq(schema.wallets.marked_to_delete, 0),
              )
            : undefined;

          localData = (await db
            .select()
            .from(schema.wallets)
            .where(whereClause!)
            .orderBy(desc(schema.wallets.created))) as T[];
        }

        if (dataBaseName === "transactions") {
          const whereClause = filters.uid
            ? and(
                eq(schema.transactions.user, String(filters.uid)),
                eq(schema.transactions.marked_to_delete, 0),
              )
            : undefined;

          // Realizamos o JOIN para buscar o nome da wallet
          const results = await db
            .select({
              id: schema.transactions.id,
              amount: schema.transactions.amount,
              type: schema.transactions.type,
              category: schema.transactions.category,
              date: schema.transactions.date,
              description: schema.transactions.description,
              walletId: schema.transactions.walletId,
              // Busca apenas o nome da carteira
              walletName: schema.wallets.name,
            })
            .from(schema.transactions)
            .leftJoin(
              schema.wallets,
              eq(schema.transactions.walletId, schema.wallets.id),
            )
            .where(whereClause!)
            .limit(30)
            .orderBy(desc(schema.transactions.id));

          localData = results as T[];
        }

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
