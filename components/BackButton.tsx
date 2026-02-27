import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { BackButtonProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Ionicons } from "@expo/vector-icons"; // Troquei para Ionicons por ser mais moderno
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function BackButton({
  style,
  onPress,
  iconSize = 24,
}: BackButtonProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const activeColors = Colors[theme];

  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => router.back()}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor:
            theme === "dark" ? activeColors.navBackground : "#F3F4F6",
        },
        style,
      ]}
    >
      <Ionicons
        name="chevron-back"
        size={verticalScale(iconSize)}
        color={activeColors.title}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: scale(8),
    borderRadius: verticalScale(12),
    // Sombra leve para dar profundidade no modo light
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
});
