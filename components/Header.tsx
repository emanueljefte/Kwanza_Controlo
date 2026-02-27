import { Colors } from "@/constants/colors";
import { HeaderProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, View } from "react-native";
import Typo from "./Typo";

export default function Header({ title = "", leftIcon, style }: HeaderProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Container do Ícone Esquerdo */}
      {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

      {/* Título Centralizado */}
      {title && (
        <View style={styles.titleWrapper}>
          <Typo
            size={18}
            fontWeight={"700"}
            color={Colors.primary}
            style={styles.titleText}
          >
            {title}
          </Typo>
        </View>
      )}

      {/* Placeholder para equilibrar o Flexbox caso haja ícone na esquerda */}
      {leftIcon && <View style={styles.rightPlaceholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Garante centralização real
    paddingVertical: verticalScale(10),
    minHeight: verticalScale(50),
  },
  leftIconContainer: {
    position: "absolute", // Retira o ícone do fluxo para não empurrar o texto
    left: 0,
    zIndex: 10,
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    textTransform: "uppercase",
    letterSpacing: 1.2, // Um toque de sofisticação para títulos em uppercase
  },
  rightPlaceholder: {
    width: scale(40), // Mesma largura aproximada do ícone para manter o equilíbrio visual se necessário
    opacity: 0,
  },
});
