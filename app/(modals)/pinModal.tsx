import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { SecurityService } from "@/services/SecurityService";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

type PinState = "VERIFY_OLD" | "ENTER_NEW" | "CONFIRM_NEW";

export default function PinModal() {
  const [pin, setPin] = useState("");
  const [oldPinFromStore, setOldPinFromStore] = useState<string | null>(null);
  const [firstNewPin, setFirstNewPin] = useState("");
  const [currentState, setCurrentState] = useState<PinState>("VERIFY_OLD");
  const [title, setTitle] = useState("PIN Antigo");

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
            Alert.alert("Erro", "PIN antigo incorreto!");
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
            Alert.alert("Sucesso", "PIN configurado com sucesso!");
            router.push("/screens/pin");
          } else {
            Vibration.vibrate(100);
            Alert.alert("Erro", "Os novos PINs não coincidem!");
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
    <ScreenWrapper style={styles.container}>
      {/* Header com botão de fechar opcional */}
      <View style={styles.header}>
        <Typo style={styles.heading} fontWeight={"700"} size={22}>
          {title}
        </Typo>
        <Typo color="#888" size={14}>
          Insira 4 dígitos para continuar
        </Typo>
      </View>

      {/* Indicadores de PIN */}
      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDigit,
              pin.length > index && styles.filledDigit,
              // Destaque visual se estivermos a criar um novo
              currentState !== "VERIFY_OLD" &&
                pin.length > index && { backgroundColor: Colors.primary },
            ]}
          />
        ))}
      </View>

      {/* Teclado Numérico */}
      <View style={styles.keypadContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            onPress={() => handlePinPress(num)}
            style={styles.keypadButton}
          >
            <Typo fontWeight={"600"} size={30}>
              {num}
            </Typo>
          </TouchableOpacity>
        ))}

        {/* Espaço vazio para alinhar o 0 ao centro */}
        <View style={styles.keypadButton} />

        <TouchableOpacity
          onPress={() => handlePinPress(0)}
          style={styles.keypadButton}
        >
          <Typo fontWeight={"600"} size={30}>
            0
          </Typo>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeletePress}
          style={styles.keypadButton}
        >
          <FontAwesome6 name="delete-left" size={24} color={Colors.warning} />
        </TouchableOpacity>
      </View>
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
    gap: 5,
  },
  heading: {
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pinContainer: {
    flexDirection: "row",
    gap: scale(20),
    marginVertical: verticalScale(20),
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
    backgroundColor: "#1A1A1A", // Tom escuro para destacar o número
  },
});
