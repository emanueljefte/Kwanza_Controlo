import { AuthContextType, UserType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        
        if (userJson) {
          const { user} = JSON.parse(userJson);
console.log("user: " + user);
          setUser(user);
          if (user?.uid) {
            updateUserData(user.uid);
          }
          router.replace("/(tabs)");
        } else {
          setUser(null);
          router.replace("/(auth)/welcome");
        }
      } catch (error) {
        console.log("Erro ao verificar usuário:", error);
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://10.109.30.111:3000/api/v1/users/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.status === 200) {
        await AsyncStorage.setItem(
          "token",
          data.token
        );
        await AsyncStorage.setItem(
          "refreshToken",
          data.refreshToken
        );
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ user: data.data })
        );
        setUser(data.data);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return {success: false, msg: data.msg}
      }
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-credential)"))
        msg = "Credenciais Erradas";
      if (msg.includes("(auth/invalid-email)")) msg = "E-mail Inválido";
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Sem conexão com a internet. Tente novamente mais tarde!";
      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const res = await fetch(
        "http://10.109.30.111:3000/api/v1/users/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const data = await res.json();
      if (res.status === 201) {
        return { success: true };
      } else {
        return {success: false, msg: data.msg}
      }
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-credential)"))
        msg = "Credenciais Erradas";
      if (msg.includes("(auth/invalid-email)")) msg = "E-mail Inválido";
      if (
        msg.includes("(auth/network-request-failed)") ||
        msg.includes("Network request failed")
      )
        msg = "Sem conexão com a internet. Tente novamente mais tarde!";
      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      // const userJson = await AsyncStorage.getItem(`user`);
      let token = await AsyncStorage.getItem('token');
      const res = await fetch("http://10.0.2.2:3000/api/v1/users/" + uid, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // const data = JSON.parse(userJson);
        const data = await res.json();
        const userData: UserType = {
          uid: data.uid,
          email: data.email || null,
          name: data.name || null,
          image: data.image || null,
        };
        
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ user: data })
        );
        setUser({ ...userData });
      } else {
        console.log("Usuário não encontrado no AsyncStorage.");
        logout()
      }
    } catch (error: any) {
      console.log("Erro ao carregar dados do usuário:", error.message);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "refreshToken", "user"])
    setUser(null);
    setIsAuthenticated(false);
    router.replace("/(auth)/welcome")
  };

  return (
    <AuthContext.Provider
      value={{ login, register, logout, setUser, updateUserData, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
