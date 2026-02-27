import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { scale, verticalScale } from "@/utils/styling";
import {
    CopyrightIcon,
    GithubLogoIcon,
    GlobeIcon,
    InfoIcon
} from "phosphor-react-native";
import React from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

export default function AboutApp() {
  const appVersion = "1.0.4"; // Idealmente viria do app.json via Expo Constants

  return (
    <View style={styles.container}>
      <Typo size={18} fontWeight="700" style={styles.title}>
        Sobre o App
      </Typo>

      <View style={styles.card}>
        {/* LOGO E VERSÃO */}
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            {/* Substitua pelo seu <Image /> real */}
            <InfoIcon size={40} color={Colors.primary} weight="duotone" />
          </View>
          <Typo size={22} fontWeight="800">
            Finance App
          </Typo>
          <Typo size={14} color="#888">
            Versão ${appVersion}
          </Typo>
        </View>

        <View style={styles.divider} />

        {/* INFO DO DESENVOLVEDOR */}
        <View style={styles.section}>
          <Typo size={14} color="#AAA" style={{ marginBottom: 10 }}>
            Desenvolvido por
          </Typo>
          <Typo size={16} fontWeight="600">
            Seu Nome / Sua Empresa
          </Typo>
        </View>

        {/* LINKS SOCIAIS / CONTATO */}
        <View style={styles.footer}>
          <Pressable
            style={styles.socialBtn}
            onPress={() => Linking.openURL("https://github.com")}
          >
            <GithubLogoIcon size={24} color="#fff" weight="fill" />
          </Pressable>

          <Pressable
            style={styles.socialBtn}
            onPress={() => Linking.openURL("https://seuwebsite.com")}
          >
            <GlobeIcon size={24} color="#fff" weight="fill" />
          </Pressable>
        </View>

        <View style={styles.copyright}>
          <CopyrightIcon size={12} color="#666" />
          <Typo size={12} color="#666">
            {" "}
            2026 Todos os direitos reservados.
          </Typo>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(25),
    paddingHorizontal: scale(5),
  },
  title: {
    marginBottom: verticalScale(15),
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 28,
    padding: scale(20),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  header: {
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  logoPlaceholder: {
    width: scale(80),
    height: scale(80),
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  section: {
    alignItems: "center",
    marginVertical: verticalScale(15),
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  footer: {
    flexDirection: "row",
    gap: scale(20),
    marginTop: verticalScale(10),
  },
  socialBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: scale(12),
    borderRadius: 50,
  },
  copyright: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(25),
    opacity: 0.5,
  },
});
