import CustomAlert from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import { SecurityService } from "@/services/SecurityService";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Vibration } from "react-native";
import PinModalView from "./_pinModalView";

type PinState = "VERIFY_OLD" | "ENTER_NEW" | "CONFIRM_NEW";

export default function PinModal() {
  const [pin, setPin] = useState("");
  const [oldPinFromStore, setOldPinFromStore] = useState<string | null>(null);
  const [firstNewPin, setFirstNewPin] = useState("");
  const [currentState, setCurrentState] = useState<PinState>("VERIFY_OLD");
  const [title, setTitle] = useState("PIN Antigo");
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  useEffect(() => {
    async function loadCurrentPin() {
      const saved = await SecurityService.getPin();
      setOldPinFromStore(saved);
      if (!saved) {
        setCurrentState("ENTER_NEW");
        setTitle("Crie o seu novo PIN");
      } else {
        setTitle("Introduza o PIN Antigo");
      }
    }
    loadCurrentPin();
  }, []);

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "error",
  ) => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const handlePinPress = async (digit: number) => {
    if (pin.length >= 4) return;

    Vibration.vibrate(10); // Pequeno feedback tátil
    const newPinEntry = pin + digit;
    setPin(newPinEntry);

    if (newPinEntry.length === 4) {
      // Pequeno delay para o utilizador ver o último ponto preencher
      setTimeout(async () => {
        if (currentState === "VERIFY_OLD") {
          if (newPinEntry === oldPinFromStore) {
            setCurrentState("ENTER_NEW");
            setPin("");
            setTitle("Digite o Novo PIN");
          } else {
            Vibration.vibrate(100);
            showAlert("Erro", "PIN antigo incorreto!");
            setPin("");
          }
        } else if (currentState === "ENTER_NEW") {
          setFirstNewPin(newPinEntry);
          setCurrentState("CONFIRM_NEW");
          setPin("");
          setTitle("Confirme o Novo PIN");
        } else if (currentState === "CONFIRM_NEW") {
          if (newPinEntry === firstNewPin) {
            await SecurityService.savePin(newPinEntry);
            showAlert("Sucesso", "PIN configurado com sucesso!", "success");
            setTimeout(() => {
              router.push("/screens/pin");
            }, 2000);
          } else {
            Vibration.vibrate(100);
            showAlert("Erro", "Os novos PINs não coincidem!");
            setPin("");
            setCurrentState("ENTER_NEW");
            setTitle("Digite o Novo PIN");
          }
        }
      }, 100);
    }
  };

  const handleDeletePress = () => {
    Vibration.vibrate(5);
    setPin(pin.slice(0, -1));
  };

  return (
    <ScreenWrapper>
      <PinModalView
        pin={pin}
        title={title}
        state={currentState}
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
