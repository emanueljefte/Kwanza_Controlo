import { ResponseType, WalletType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  let token = await AsyncStorage.getItem("token");
  try {
    let walletToSave = { ...walletData };
    
    if (!walletData?.id) {
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }
    const fetchData = walletData?.id
    ? {
          url:
            "http://10.0.2.2:3000/api/v1/wallets/" + walletData?.id,
            method: "PUT",
        }
        : {
          url: "http://10.0.2.2:3000/api/v1/wallets/",
          method: "POST",
        };
    
        const res = await fetch(fetchData.url, {
      method: fetchData.method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(walletToSave),
    });
    console.log(walletToSave);
    console.log(fetchData.method);
    
    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        msg: data.msg || "Falha no upload da carteira",
      };
      walletToSave = data.wallet;
    
    return {success: true, data: {...walletToSave}}

  } catch (error: any) {
    console.log("Erro ao criar ou atualizar carteira: ", error);
    return { success: false, msg: error.message };
  }
};


export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  let token = await AsyncStorage.getItem("token");
  try {
    const res = await fetch("http://10.0.2.2:3000/api/v1/wallets/" + walletId, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        msg: data.msg || "Falha no delete da carteira",
      };
    
    return {success: true, msg: "Carteira deletado com sucesso"}
  } catch (error: any) {
    console.log("Erro ao deletar carteira", error);
    return {success: false, msg: error.message}
    
  }
}