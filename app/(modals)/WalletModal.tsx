import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/AuthProvider";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
export default function WalletModal() {
  const {user }=useAuth()
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const oldWallet: {name: string, image: string, id: string} = useLocalSearchParams()

  useEffect(() => {
    
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet?.name,
        image: oldWallet?.image
      }) 
      
    }
  }, [])
  const onSubmit = async () => {
    let { name, image } = wallet;
    
    if (!name.trim() || !image) {
      Alert.alert("Usuário", "Por favor Preencha todos os campos");
      return
    }
    const data: WalletType = {
      name, image, uid: user?.uid
    }
    if (oldWallet?.id) data.id = oldWallet.id
    setLoading(true)
   
    const res = await createOrUpdateWallet(data)
    setLoading(false)
    if (res.success) {
      router.back()
    } else {
      Alert.alert("Wallet", res.msg)
    }
  };
  
  const onDelete = async () => {
    if(!oldWallet?.id) return
    setLoading(true)
    const res = await deleteWallet(oldWallet?.id)
    setLoading(false)
    if (res.success) {
      router.back()
    } else {
      Alert.alert("Wallet", res.msg)
    }
  }

  const showDeleteAlert = () => {
    Alert.alert("Confirmação", "Tens ceteza que pretendes realizar isto? \nEsta ação removerá todas as transações relacionadas com este cartão", [ {
        text: "Cancelar",
        onPress: () => console.log("Deletar cancelado"),
        style: "cancel",
      },
      {
        text: "Deletar",
        onPress: () => onDelete(),
        style: "destructive",
      },])
  }

  return (
    <ModalWrapper>
      <View
        style={{ paddingHorizontal: verticalScale(20) }}
        className="flex-1 justify-between"
      >
        <Header
          title= {oldWallet?.id ? "Atualizar Cartão" : "Novo Cartão"}
          leftIcon={<BackButton />}
          style={{ marginBottom: verticalScale(10) }}
        />

        <ScrollView
          contentContainerStyle={{
            gap: verticalScale(30),
            marginTop: verticalScale(15),
          }}
        >
          <View style={{ gap: verticalScale(10) }}>
            <Typo color={"#bbb"}>Nome do Cartão</Typo>
            <Input
              placeholder="Salário"
              value={wallet.name}
              onChangeText={(value) =>
                setWallet({ ...wallet, name: value })
              }
            />
          </View>
          <View style={{ gap: verticalScale(10) }}>
            <Typo color={"#bbb"}>Imagem do Cartão</Typo>
            <ImageUpload file={wallet.image} onSelect={file => setWallet({...wallet, image: file})} onClear={() => setWallet({...wallet, image: null})} placeholder="Carregar Imagem" />
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          paddingHorizontal: scale(20),
          paddingTop: verticalScale(15),
          marginBottom: verticalScale(55),
          gap: scale(12),
        }}
        className="items-center flex-row justify-center border-t-neutral-700 border-t"
      >
        {
          oldWallet?.id && !loading && (
            <Button style={{paddingHorizontal: scale(15), backgroundColor: "#dc2626"}} onPress={showDeleteAlert}>
              <FontAwesome name="trash" color={"#fff"} size={verticalScale(24)} />
            </Button>
          )
        }
        <Button onPress={onSubmit} loading={loading} style={{flex: 1}} >
          <Typo color="#000" fontWeight={"700"}>
            {
              oldWallet?.id ? "Actualizar Cartão" : "Adicionar Cartão"
            }
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
}
