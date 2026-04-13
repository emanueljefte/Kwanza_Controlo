import CustomAlert from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import { SecurityService } from "@/services/SecurityService";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Vibration } from "react-native";
import RemovalPinModalView from "./_removalPinModalView";

export default function RemovalPinModal() {
  const [pin, setPin] = useState("");
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  useEffect(() => {
    async function loadPin() {
      const pinFromStore = await SecurityService.getPin();
      if (!pinFromStore) {
        showAlert("Aviso", "Não existe um PIN definido.");
        router.back();
      }
      setSavedPin(pinFromStore);
    }
    loadPin();
  }, []);

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "error",
  ) => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const handlePinPress = (digit: number) => {
    if (pin.length >= 4) return;

    Vibration.vibrate(10);
    const newPinEntry = pin + digit;
    setPin(newPinEntry);

    if (newPinEntry.length === 4) {
      setTimeout(() => {
        if (newPinEntry === savedPin) {
          confirmRemoval();
        } else {
          Vibration.vibrate(100);
          showAlert("Erro", "PIN incorreto!");
          setPin("");
        }
      }, 100);
    }
  };

  const confirmRemoval = () => {
    Alert.alert(
      "Remover Segurança",
      "Tens a certeza que pretendes remover o PIN? O acesso ao app deixará de estar protegido.",
      [
        { text: "Cancelar", style: "cancel", onPress: () => setPin("") },
        {
          text: "Remover PIN",
          style: "destructive",
          onPress: async () => {
            await SecurityService.removePin();
            router.replace("/screens/pin");
          },
        },
      ],
    );
  };

  const handleDeletePress = () => {
    Vibration.vibrate(5);
    setPin(pin.slice(0, -1));
  };

  return (
    <ScreenWrapper>
      <RemovalPinModalView
        pin={pin}
        onPinPress={handlePinPress}
        onDeletePress={handleDeletePress}
      />
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </ScreenWrapper>
  );
}
