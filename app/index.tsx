import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeContext";
import { SecurityService } from "@/services/SecurityService";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const { isAuthenticated, isReady } = useAuth();
  const { theme } = useTheme();
  const [isLocked, setIsLocked] = useState(true);
  const [animationFinished, setAnimationFinished] = useState(false);
  const router = useRouter();
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
      setAnimationFinished(true);
    }, 2500);
    setAnimationFinished(true);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Só redireciona se a animação acabou E o AuthProvider carregou o DB
    async function check() {
      const pinExists = await SecurityService.hasPin();
      if (animationFinished && isReady) {
        if (isAuthenticated) {
          if (pinExists) {
            setIsLocked(true);
            // Redireciona para a tela de PIN, mas mantém o estado bloqueado
            router.replace("/(auth)/pin-lock");
          } else {
            setIsLocked(false);
            router.replace("/(tabs)");
          }
        } else {
          router.replace("/(auth)/welcome");
        }
      }
    }
    check();
  }, [animationFinished, isReady, isAuthenticated]);

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
