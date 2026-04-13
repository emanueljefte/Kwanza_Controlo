import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

export default function IndexView({
  animatedStyle,
}: {
  animatedStyle: { transform: { scale: number }[] };
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View entering={ZoomIn.duration(800)} style={animatedStyle}>
        <Animated.Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Opcional: Um indicador de carregamento bem sutil na base */}
      <Animated.View entering={FadeIn.delay(1000)} style={styles.footer}>
        <View
          style={[styles.loadingBar, { backgroundColor: Colors.dark.primary }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 250,
  },
  footer: {
    position: "absolute",
    bottom: 50,
    width: "30%",
    height: 3,
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    overflow: "hidden",
  },
  loadingBar: {
    height: "100%",
    width: "100%", // Aqui você poderia animar a largura de 0 a 100%
  },
});
