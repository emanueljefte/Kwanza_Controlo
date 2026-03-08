import * as schema from "@/db/schema";
import { AuthContextType, UserType } from "@/types";
import NetInfo from "@react-native-community/netinfo";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as Crypto from "expo-crypto"; // Para gerar UIDs únicos offline
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useSQLiteContext } from "expo-sqlite";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const router = useRouter();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected === true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const localUsers = await drizzleDb
          .select()
          .from(schema.users)
          .orderBy(desc(schema.users.last_login))
          .limit(1);

        if (localUsers.length > 0) {
          const localUser = localUsers[0];

          await drizzleDb
            .update(schema.users)
            .set({ last_login: new Date().toISOString() })
            .where(eq(schema.users.uid, localUser.uid));

          setUser(localUser as any);
          setIsAuthenticated(true);
          setIsGuest(localUser.uid === "guest");

          if (isOnline && localUser.uid !== "guest") {
            syncDataWithServer(localUser.uid);
          }
        }
      } catch (e) {
        console.error("Erro ao carregar usuário", e);
      } finally {
        setIsReady(true); // 👈 Terminou o processo (sucesso ou erro)
      }
    };
    loadUser();
  }, [isOnline]);

  // 👤 Entrar como convidado (Mesma lógica, agora centralizada)
  const enterAsGuest = async () => {
    const guestUser: UserType = {
      uid: "guest",
      name: "Convidado",
      email: null,
      image: null,
      is_dirty: 0,
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };

    await drizzleDb
      .insert(schema.users)
      .values(guestUser as any)
      .onConflictDoNothing();

    setUser(guestUser);
    setIsAuthenticated(true);
    setIsGuest(true);
    router.replace("/(tabs)");
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const existing = await drizzleDb
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email));

      if (existing.length > 0)
        return { success: false, msg: "E-mail já registrado." };

      // 🔐 1. Transformar a senha em um HASH (Segurança)
      const passwordHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password,
      );

      const newUser = {
        uid: Crypto.randomUUID(),
        name,
        email,
        password: passwordHash,
        is_dirty: 1,
        updated_at: new Date().toISOString(),
      };

      await drizzleDb.insert(schema.users).values(newUser as any);
      return { success: true };
    } catch (err) {
      return { success: false, msg: "Erro ao salvar localmente." };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const local = await drizzleDb
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email));

      if (local.length > 0) {
        const u = local[0];

        // 🔐 2. Verificar a senha offline
        const inputPasswordHash = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          password,
        );

        if (u.password === inputPasswordHash) {
          await drizzleDb
            .update(schema.users)
            .set({ last_login: new Date().toISOString() })
            .where(eq(schema.users.uid, u.uid));

          setUser(u as any);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, msg: "Palavra-passe incorreta." };
        }
      }

      // Se não houver local, tenta online...
      // if (isOnline) return await loginOnline(email, password);

      return { success: false, msg: "Usuário não encontrado offline." };
    } catch (err) {
      return { success: false, msg: "Erro no processamento." };
    }
  };

  // const loginOnline = async (email: string, password: string) => {
  //   try {
  //     const res = await fetch(
  //       `${process.env.EXPO_PUBLIC_API_DEVICE}users/auth/login`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email, password }), // Envia texto puro para o bcrypt do back
  //       },
  //     );

  //     const data = await res.json();

  //     if (res.ok) {
  //       const u = data.data;
  //       await SecureStore.setItemAsync("token", data.token);

  //       // 🔐 Gerar o hash da senha para permitir futuros logins offline
  //       const passwordHashForOffline = await Crypto.digestStringAsync(
  //         Crypto.CryptoDigestAlgorithm.SHA256,
  //         password,
  //       );

  //       await drizzleDb
  //         .insert(schema.users)
  //         .values({
  //           uid: u.uid,
  //           email: u.email,
  //           name: u.name,
  //           password: passwordHashForOffline, // SALVA O HASH AQUI
  //           is_dirty: 0,
  //         })
  //         .onConflictDoUpdate({
  //           target: schema.users.uid,
  //           set: {
  //             name: u.name,
  //             email: u.email,
  //             password: passwordHashForOffline, // ATUALIZA SE MUDOU
  //             is_dirty: 0,
  //           },
  //         });

  //       setUser(u);
  //       setIsAuthenticated(true);
  //       return { success: true };
  //     }
  //     return { success: false, msg: data.msg };
  //   } catch (err) {
  //     return { success: false, msg: "Servidor indisponível." };
  //   }
  // };

  // 🔄 Função de Sincronização (Disparada quando online)
  const syncDataWithServer = async (uid: string) => {
    const [localUser] = await drizzleDb
      .select()
      .from(schema.users)
      .where(eq(schema.users.uid, uid));

    if (localUser?.is_dirty && isOnline) {
      try {
        // Exemplo: Enviar dados pendentes para o servidor
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_DEVICE}users/sync`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(localUser),
          },
        );

        if (res.ok) {
          // Marcar como limpo localmente
          await drizzleDb
            .update(schema.users)
            .set({ is_dirty: 0 })
            .where(eq(schema.users.uid, uid));
        }
      } catch (e) {
        console.log("Falha na sincronização silenciosa");
      }
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    // await drizzleDb.delete(schema.users);
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    router.replace("/(auth)/welcome");
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout,
        enterAsGuest,
        user,
        setUser,
        isAuthenticated,
        isGuest,
        isOnline,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
