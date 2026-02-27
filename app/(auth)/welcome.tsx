import Button from "@/components/ButtonLayout";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors"; // Importe suas cores
import { useAuth } from "@/contexts/AuthProvider";
import { scale, verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function Welcome() {
  const router = useRouter();
  const { enterAsGuest } = useAuth();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Cabeçalho com Login rápido */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.loginBtn}
          >
            <Typo color={Colors.primary} fontWeight={600} size={16}>
              Entrar
            </Typo>
          </TouchableOpacity>
        </View>

        {/* Logo Centralizada com animação suave */}
        <View style={styles.logoContainer}>
          <Animated.Image
            entering={FadeIn.duration(1200)}
            source={require("@/assets/images/logo.png")}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>

        {/* Rodapé Informativo e Ações */}
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="items-center"
          >
            <Typo size={30} fontWeight={"800"} style={styles.textCenter}>
              Sempre no controle
            </Typo>
            <Typo
              size={30}
              fontWeight={"800"}
              color={Colors.primary}
              style={styles.textCenter}
            >
              das suas finanças
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(200).springify()}
            className="items-center"
          >
            <Typo size={17} color="#666" style={styles.subtitle}>
              Organize seus gastos hoje para garantir um futuro financeiro
              tranquilo.
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(400).springify()}
            style={styles.actionContainer}
          >
            <Button
              onPress={() => router.push("/(auth)/register")}
              style={{
                backgroundColor: Colors.primary,
                height: verticalScale(56),
              }}
            >
              <Typo size={20} color="#fff" fontWeight={"700"}>
                Começar agora
              </Typo>
            </Button>

            <TouchableOpacity
              className="items-center"
              onPress={() => enterAsGuest()}
              style={styles.guestBtn}
            >
              <Typo fontWeight={500} color="#888" size={15}>
                Continuar como{" "}
                <Typo fontWeight={700} color="#666">
                  Visitante
                </Typo>
              </Typo>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: verticalScale(10),
  },
  loginBtn: {
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(5),
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "80%",
    height: verticalScale(250),
  },
  footer: {
    paddingBottom: verticalScale(50),
    gap: verticalScale(25),
  },
  textCenter: {
    textAlign: "center",
    lineHeight: 36,
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: scale(20),
    lineHeight: 24,
  },
  actionContainer: {
    gap: verticalScale(15),
    width: "100%",
  },
  guestBtn: {
    paddingVertical: verticalScale(10),
  },
});
