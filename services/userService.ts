import * as schema from "@/db/schema";
import { ResponseType, UserDataType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { eq } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

let isRefreshing = false;
let failedQueue: any[] = [];

export const updateUser = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  uid: string,
  updateData: UserDataType,
): Promise<ResponseType> => {
  try {
    // 1. ATUALIZA LOCALMENTE PRIMEIRO (Sempre)
    // Isso garante que a UI reflita a mudança instantaneamente
    await db
      .update(schema.users)
      .set({
        ...updateData,
        is_dirty: 1,
        updated_at: new Date().toISOString(),
      })
      .where(eq(schema.users.uid, uid));

    // 2. TENTA SINCRONIZAR EM "FIRE AND FORGET" OU BACKGROUND
    const net = await NetInfo.fetch();
    if (net.isConnected) {
      // Tenta sincronizar, mas não bloqueia o retorno de sucesso para o usuário
      syncUserData(db, uid, updateData).catch((err) =>
        console.log(
          "Sync falhou, ficará para a próxima tentativa automática",
          err,
        ),
      );
    }

    return {
      success: true,
      msg: "Perfil atualizado!", // O usuário já vê o resultado
    };
  } catch (error: any) {
    return { success: false, msg: "Erro ao salvar localmente" };
  }
};

// Função auxiliar apenas para a parte de rede
const syncUserData = async (db: any, uid: string, data: any) => {
  const res = await fetchWithAuth(`http://10.0.2.2:3000/api/v1/users/${uid}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    await db
      .update(schema.users)
      .set({ is_dirty: 0 })
      .where(eq(schema.users.uid, uid));
  }
};

const refreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  if (!refreshToken) return null;
  const res = await fetch("http://10.0.2.2:3000/api/v1/users/refresh-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (res.ok) {
    const data = await res.json();
    await AsyncStorage.setItem("token", data.token);
    return data.token;
  } else {
    await AsyncStorage.multiRemove(["token", "refreshToken", "user"]);
    return null;
  }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let token = await AsyncStorage.getItem("token");

  const getHeaders = (t: string | null) => ({
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${t}`,
  });

  let response = await fetch(url, {
    ...options,
    headers: getHeaders(token),
  });

  // CASO 1: Token expirado (401)
  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise<Response>((resolve) => {
        failedQueue.push((newToken: string) => {
          resolve(
            fetch(url, {
              ...options,
              headers: getHeaders(newToken),
            }),
          );
        });
      });
    }

    isRefreshing = true;
    const newToken = await refreshToken();
    isRefreshing = false;

    if (newToken) {
      // Processa quem ficou na fila
      failedQueue.forEach((callback) => callback(newToken));
      failedQueue = [];

      // Tenta novamente a chamada original
      return fetch(url, {
        ...options,
        headers: getHeaders(newToken),
      });
    } else {
      // Se nem o refresh funcionou, limpa a fila e desloga
      failedQueue = [];
      throw new Error("Sessão expirada");
    }
  }

  // CASO 2: Resposta normal (200, 404, 500, etc)
  // IMPORTANTE: Este retorno deve estar fora do IF do 401
  return response;
};
