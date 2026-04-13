import CustomAlert from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { ShieldCheckeredIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type PinLockViewProps = {
  pin: string;
  alertConfig: {
    visible: boolean;
    title: string;
    message: string;
    type: any;
  };
  setAlertConfig: (value: {
    visible: boolean;
    title: string;
    message: string;
    type: any;
  }) => void;
  onPinPress: (value: number) => void;
  onBiometricAuth: () => void;
  onDeletePress: () => void;
};

export default function PinLockView({
  pin,
  alertConfig,
  setAlertConfig,
  onPinPress,
  onBiometricAuth,
  onDeletePress,
}: PinLockViewProps) {
  const { theme } = useTheme();

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <ShieldCheckeredIcon
          size={scale(50)}
          color={Colors.dark.primary}
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
            onPress={() => onPinPress(num)}
            style={styles.keypadButton}
          >
            <Typo fontWeight={"600"} size={30} color="#fff">
              {num}
            </Typo>
          </TouchableOpacity>
        ))}

        {/* Botão Biometria */}
        <TouchableOpacity onPress={onBiometricAuth} style={styles.keypadButton}>
          <FontAwesome6
            name="fingerprint"
            size={28}
            color={Colors.dark.primary}
          />
        </TouchableOpacity>

        {/* <View style={styles.keypadButton} /> */}

        <TouchableOpacity
          onPress={() => onPinPress(0)}
          style={styles.keypadButton}
        >
          <Typo fontWeight={"600"} size={30} color="#fff">
            0
          </Typo>
        </TouchableOpacity>

        {/* Botão Deletar */}
        <TouchableOpacity onPress={onDeletePress} style={styles.keypadButton}>
          <FontAwesome6
            name="delete-left"
            size={24}
            color={Colors.dark.warning}
          />
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
  footer: {
    padding: 10,
  },
});
