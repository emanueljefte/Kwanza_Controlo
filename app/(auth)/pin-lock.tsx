import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { SecurityService } from "@/services/SecurityService";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication"; // Para Biometria
import { useRouter } from "expo-router";
import { ShieldCheckeredIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

export default function PinLockScreen() {
  const [pin, setPin] = useState("");
  const { theme } = useTheme();
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const router = useRouter();

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
          Alert.alert("Erro", "PIN incorreto!");
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
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <ShieldCheckeredIcon
          size={scale(50)}
          color={Colors.primary}
          weight="fill"
        />
        <Typo style={styles.heading} fontWeight={"700"} size={22}>
          Bem-vindo de volta
        </Typo>
        <Typo color="#888" size={14}>
          Introduza o seu código para entrar
        </Typo>
      </View>

      {/* Indicadores de PIN */}
      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[styles.pinDigit, pin.length > index && styles.filledDigit]}
          />
        ))}
      </View>

      {/* Teclado */}
      <View style={styles.keypadContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            onPress={() => handlePinPress(num)}
            style={styles.keypadButton}
          >
            <Typo
              fontWeight={"600"}
              color={theme === "light" ? "#fff" : ""}
              size={30}
            >
              {num}
            </Typo>
          </TouchableOpacity>
        ))}

        {/* Botão Biometria */}
        <TouchableOpacity
          onPress={handleBiometricAuth}
          style={styles.keypadButton}
        >
          <FontAwesome6 name="fingerprint" size={28} color={Colors.primary} />
        </TouchableOpacity>

        {/* <View style={styles.keypadButton} /> */}

        <TouchableOpacity
          onPress={() => handlePinPress(0)}
          style={styles.keypadButton}
        >
          <Typo
            fontWeight={"600"}
            color={theme === "light" ? "#fff" : ""}
            size={30}
          >
            0
          </Typo>
        </TouchableOpacity>

        {/* Botão Deletar */}
        <TouchableOpacity
          onPress={handleDeletePress}
          style={styles.keypadButton}
        >
          <FontAwesome6 name="delete-left" size={24} color={Colors.warning} />
        </TouchableOpacity>
      </View>

      {/* Rodapé: Caso o user queira sair/logout da conta */}
      <TouchableOpacity
        style={styles.footer}
        onPress={() => router.replace("/(auth)/welcome")}
      >
        <Typo color="#555" size={14} fontWeight="500">
          Mudar de conta?
        </Typo>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: verticalScale(40),
  },
  header: {
    alignItems: "center",
    gap: 12,
  },
  heading: {
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pinContainer: {
    flexDirection: "row",
    gap: scale(20),
  },
  pinDigit: {
    width: scale(18),
    height: scale(18),
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#333",
    backgroundColor: "transparent",
  },
  filledDigit: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  keypadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: scale(300),
    justifyContent: "center",
    rowGap: verticalScale(15),
    columnGap: scale(15),
  },
  keypadButton: {
    width: scale(75),
    height: scale(75),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    backgroundColor: "#1A1A1A",
  },
  footer: {
    padding: 10,
  },
});
