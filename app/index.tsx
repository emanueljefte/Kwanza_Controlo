import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const activeColors = Colors[theme];

  // Efeito de pulso suave na logo
  const scale = useSharedValue(1);

  useEffect(() => {
    // Inicia animação de pulso
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true,
    );

    // Redireciona após 2.5 segundos
    const timer = setTimeout(() => {
      router.replace("/(auth)/welcome"); // Use replace para o usuário não voltar ao splash
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: activeColors.background }]}
    >
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
          style={[styles.loadingBar, { backgroundColor: Colors.primary }]}
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
