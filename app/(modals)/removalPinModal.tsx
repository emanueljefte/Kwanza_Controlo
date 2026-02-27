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

export default function RemovalPinModal() {
  const [pin, setPin] = useState("");
  const [savedPin, setSavedPin] = useState<string | null>(null);

  useEffect(() => {
    async function loadPin() {
      const pinFromStore = await SecurityService.getPin();
      if (!pinFromStore) {
        Alert.alert("Aviso", "Não existe um PIN definido.");
        router.back();
      }
      setSavedPin(pinFromStore);
    }
    loadPin();
  }, []);

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
          Alert.alert("Erro", "PIN incorreto!");
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
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <FontAwesome6
          name="unlock-keyhole"
          size={scale(40)}
          color={Colors.warning}
        />
        <Typo
          style={styles.heading}
          color={Colors.warning}
          fontWeight={"700"}
          size={22}
        >
          Desativar PIN
        </Typo>
        <Typo color="#888" size={14} style={{ textAlign: "center" }}>
          Confirma o teu código atual para remover a proteção de acesso.
        </Typo>
      </View>

      {/* Indicadores Visuais */}
      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[styles.pinDigit, pin.length > index && styles.filledDigit]}
          />
        ))}
      </View>

      {/* Teclado Numérico Estilizado */}
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
        <View style={styles.keypadButton} />{" "}
        {/* Espaço vazio para alinhar o 0 */}
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
    paddingVertical: verticalScale(30),
  },
  header: {
    alignItems: "center",
    gap: 15,
    paddingHorizontal: scale(40),
  },
  heading: {
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 10,
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
    backgroundColor: Colors.warning,
    borderColor: Colors.warning,
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
});
