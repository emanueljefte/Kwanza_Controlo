import { Colors } from "@/constants/colors";
import { scale, verticalScale } from "@/utils/styling";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import Button from "./ButtonLayout";
import Typo from "./Typo";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export default function CustomAlert({
  visible,
  title,
  message,
  type = "info",
  onClose,
}: CustomAlertProps) {
  const iconName =
    type === "success"
      ? "check-circle"
      : type === "error"
        ? "alert-circle"
        : "info";
  const iconColor =
    type === "success"
      ? "#10b981"
      : type === "error"
        ? Colors.warning
        : Colors.primary;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Feather name={iconName} size={verticalScale(50)} color={iconColor} />

          <View style={styles.textContainer}>
            <Typo size={22} fontWeight="700" style={{ textAlign: "center" }}>
              {title}
            </Typo>
            <Typo
              size={16}
              color="#666"
              style={{ textAlign: "center", marginTop: 8 }}
            >
              {message}
            </Typo>
          </View>

          <Button
            onPress={onClose}
            style={{
              backgroundColor: iconColor,
              width: "100%",
              height: verticalScale(50),
            }}
          >
            <Typo color="white" fontWeight="700">
              Entendido
            </Typo>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(30),
  },
  alertBox: {
    width: "100%",
    backgroundColor: "white", // Adicione suporte ao tema aqui se necessário
    borderRadius: verticalScale(24),
    padding: scale(25),
    alignItems: "center",
    gap: verticalScale(20),
  },
  textContainer: {
    alignItems: "center",
  },
});
