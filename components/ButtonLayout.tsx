import { Colors } from "@/constants/colors";
import { CustomButtonProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface EnhancedButtonProps extends CustomButtonProps {
  variant?: "primary" | "outline" | "ghost";
  disabled?: boolean;
}

export default function Button({
  style,
  onPress,
  loading = false,
  children,
  variant = "primary",
  disabled = false,
}: EnhancedButtonProps) {
  // Lógica de cores baseada na variante
  const isOutline = variant === "outline";
  const buttonColor = isOutline ? "transparent" : Colors.primary;
  const borderColor = isOutline ? Colors.primary : "transparent";

  // Desativar se estiver carregando ou explicitamente desativado
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.baseButton,
        {
          backgroundColor: buttonColor,
          borderColor: borderColor,
          borderWidth: isOutline ? 1.5 : 0,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isOutline ? Colors.primary : "#FFF"}
          size="small"
        />
      ) : (
        // Se o children for apenas texto, o Typo será renderizado aqui
        <View style={styles.content}>{children}</View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: verticalScale(54),
    borderRadius: verticalScale(16), // Combinando com o seu Input
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: scale(20),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
  },
});
