import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type PinModalProps = {
  title: string;
  pin: string;
  state: String;
  onPinPress: (value: number) => void;
  onDeletePress: () => void;
};
export default function PinModalView({
  title,
  pin,
  state,
  onPinPress,
  onDeletePress,
}: PinModalProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Header com botão de fechar opcional */}
      <View style={styles.header}>
        <FontAwesome6
          name="unlock-keyhole"
          size={scale(40)}
          color={Colors.dark.warning}
        />
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
              state !== "VERIFY_OLD" &&
                pin.length > index && { backgroundColor: Colors.dark.primary },
            ]}
          />
        ))}
      </View>

      {/* Teclado Numérico */}
      <View style={styles.keypadContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            onPress={() => onPinPress(num)}
            style={styles.keypadButton}
          >
            <Typo fontWeight={"600"} size={30} color="#fff">
              {num}
            </Typo>
          </TouchableOpacity>
        ))}

        {/* Espaço vazio para alinhar o 0 ao centro */}
        <View
          style={[styles.keypadButton, { backgroundColor: "transparent" }]}
        />

        <TouchableOpacity
          onPress={() => onPinPress(0)}
          style={styles.keypadButton}
        >
          <Typo fontWeight={"600"} size={30} color="#fff">
            0
          </Typo>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDeletePress} style={styles.keypadButton}>
          <FontAwesome6
            name="delete-left"
            size={24}
            color={Colors.dark.warning}
          />
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
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
