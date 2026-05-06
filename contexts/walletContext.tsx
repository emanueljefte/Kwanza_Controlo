import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface WalletContextType {
  selectedWalletId: number | null; // Guardamos apenas o ID
  setSelectedWalletId: (id: number | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedWalletId, setSelectedIdState] = useState<number | null>(null);

  useEffect(() => {
    const loadId = async () => {
      const savedId = await AsyncStorage.getItem("@selected_id");
      if (savedId) setSelectedIdState(Number(savedId));
    };
    loadId();
  }, []);

  const setSelectedWalletId = async (id: number | null) => {
    setSelectedIdState(id);
    if (id) {
      await AsyncStorage.setItem("@selected_id", id.toString());
    } else {
      await AsyncStorage.removeItem("@selected_id");
    }
  };

  return (
    <WalletContext.Provider value={{ selectedWalletId, setSelectedWalletId }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context)
    throw new Error("useWallet deve ser usado dentro de WalletProvider");
  return context;
};
