import CustomAlert from "@/components/CustomAlert";
import ModalWrapper from "@/components/ModalWrapper";
import { useAuth } from "@/contexts/AuthProvider";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { WalletType } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import WalletModalView from "./_walletModalView";

export default function WalletModal() {
  const { user } = useAuth();
  const router = useRouter();
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  const { id, name, image } = useLocalSearchParams();

  const [wallet, setWallet] = useState<Partial<WalletType>>({
    name: "",
    image: "bank", // Agora usaremos o nome do ícone aqui
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 2. Verifique se o ID existe e se o estado atual ainda está vazio
    // para evitar sobrescrever alterações do usuário
    if (id && !wallet.name) {
      setWallet({
        name: name as string,
        image: (image as string) || "bank",
      });
    }
  }, [id, name, image]);

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "error",
  ) => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const handleSubmit = async () => {
    let { name, image } = wallet;
    if (!name?.trim() || !image) {
      showAlert("Carteira", "Por favor, dê um nome à sua carteira");
      return;
    }

    const data: WalletType = {
      name: name.trim(),
      image,
      user: user?.uid,
    };

    if (id) data.id = Number(id);

    setLoading(true);
    const res = await createOrUpdateWallet(data);
    setLoading(false);

    if (res.success) router.back();
    else showAlert("Erro", res.msg as string);
  };

  const onDelete = async () => {
    if (!id) return;
    setLoading(true);
    const res = await deleteWallet(Number(id));
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirmação",
      "Tens ceteza que pretendes realizar isto? \nEsta ação removerá todas as transações relacionadas com este cartão",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Deletar cancelado"),
          style: "cancel",
        },
        {
          text: "Deletar",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ],
    );
  };

  return (
    <ModalWrapper>
      <WalletModalView
        id={id}
        wallet={wallet}
        loading={loading}
        setWallet={setWallet}
        showDeleteAlert={showDeleteAlert}
        onSubmit={handleSubmit}
      />
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </ModalWrapper>
  );
}
