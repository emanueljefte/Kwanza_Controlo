import { TransactionType } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createOrUpdateTransaction = async (transactionData: Partial<TransactionType>) => {
    try {
        const {id, type, walletId, amount, image} = transactionData
        if (!amount || amount<=0 || !walletId || !type) {
            return {success: false, msg: 'Dados da transação inválidas'}
        }

        if (id) {

        } else {

        }

        return {sucess: true}

    } catch (error: any) {
        console.log('Erro ao criar e actualizar transação: ', error);
        return {success: false, msg: error.message}
    }
}

const updateWalletForNewTransaction = async (walletId:string, amount: number, type: string) => {
    let token = await AsyncStorage.getItem("token");
    try {
       
    
     return {sucess: true}

    } catch (error: any) {
        console.log('Erro ao actualizar a carteira pela nova transação: ', error);
        return {success: false, msg: error.message}
    }
}