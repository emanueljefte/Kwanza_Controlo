import { SecurityService } from "@/services/SecurityService";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Vibration } from "react-native";
import PinLockView from "./_pin-lockView";

export default function PinLock() {
  const [pin, setPin] = useState("");
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "error",
  ) => {
    setAlertConfig({ visible: true, title, message, type });
  };

  useEffect(() => {
    async function init() {
      const pinFromStore = await SecurityService.getPin();
      if (!pinFromStore) {
        router.replace("/(auth)/welcome");
        return;
      }
      setSavedPin(pinFromStore);
      // Opcional: Tentar biometria automaticamente ao abrir
      handleBiometricAuth();
    }
    init();
  }, []);

  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Entrar com Biometria",
        fallbackLabel: "Usar PIN",
      });

      if (result.success) {
        router.replace("/(tabs)");
      }
    }
  };

  const handlePinPress = (digit: number) => {
    if (pin.length >= 4) return;

    Vibration.vibrate(10);
    const newPinEntry = pin + digit;
    setPin(newPinEntry);

    if (newPinEntry.length === 4) {
      setTimeout(() => {
        if (newPinEntry === savedPin) {
          router.replace("/(tabs)");
        } else {
          Vibration.vibrate(100);
          showAlert("Erro", "PIN incorreto!");
          setPin("");
        }
      }, 100);
    }
  };

  const handleDeletePress = () => {
    Vibration.vibrate(5);
    setPin(pin.slice(0, -1));
  };

  return (
    <PinLockView
      pin={pin}
      alertConfig={alertConfig}
      setAlertConfig={setAlertConfig}
      onPinPress={handlePinPress}
      onBiometricAuth={handleBiometricAuth}
      onDeletePress={handleDeletePress}
    />
  );
}
