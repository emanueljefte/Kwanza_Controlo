import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { verticalScale } from "@/utils/styling";
import React from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
  View
} from "react-native";
import Typo from "./Typo"; // Assumindo que seu componente de texto se chama Typo

interface LoadingProps extends ActivityIndicatorProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({
  size = "large",
  color,
  message,
  fullScreen = true,
}: LoadingProps) {
  const { theme } = useTheme();
  const activeColors = Colors[theme];

  // Define a cor primária da logo como padrão caso não seja passada via props
  const loaderColor = color || Colors.primary;

  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        {
          backgroundColor: fullScreen ? activeColors.background : "transparent",
        },
      ]}
    >
      <View style={styles.content}>
        <ActivityIndicator size={size} color={loaderColor} />

        {message && (
          <Typo
            size={16}
            color={activeColors.text}
            style={styles.message}
            fontWeight={500}
          >
            {message}
          </Typo>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreen: {
    flex: 1,
    // Se for usar como overlay sobre um conteúdo, pode usar position absolute
    // position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 999
  },
  content: {
    alignItems: "center",
    gap: verticalScale(12),
  },
  message: {
    marginTop: verticalScale(10),
    textAlign: "center",
    opacity: 0.8,
  },
});
