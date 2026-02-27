import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { accountOptionsType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons"; // Ícones mais modernos
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function Settings() {
  const router = useRouter();

  const accountOptions: accountOptionsType[] = [
    {
      title: "Segurança (PIN)",
      icon: <FontAwesome6 name="lock" size={18} color={"#fff"} />,
      routeName: "/screens/pin",
      bgColor: "#6366f1",
    },
    {
      title: "Aparência",
      icon: <FontAwesome6 name="palette" size={18} color={"#fff"} />,
      routeName: "/(modals)/apearenceModal",
      bgColor: "#059669",
    },
    {
      title: "Dados e Armazenamento",
      icon: <FontAwesome6 name="database" size={18} color={"#fff"} />,
      routeName: "/screens/storageSettings",
      bgColor: "#737373",
    },
    {
      title: "Sobre o App",
      icon: <FontAwesome6 name="circle-info" size={18} color={"#fff"} />,
      routeName: "/screens/aboutApp",
      bgColor: "#e11d48",
    },
  ];

  const handlePress = (item: accountOptionsType) => {
    if (item.routeName) {
      router.push(item.routeName as any);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title="Configurações"
          leftIcon={<BackButton />}
          style={{ marginBottom: verticalScale(20) }}
        />

        <View style={styles.sectionContainer}>
          {accountOptions.map((item, index) => (
            <Animated.View
              key={index.toString()}
              entering={FadeInDown.delay(index * 100).damping(16)}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.optionItem}
                onPress={() => handlePress(item)}
              >
                {/* Ícone com Fundo Colorido Dinâmico */}
                <View
                  style={[
                    styles.iconWrapper,
                    { backgroundColor: item.bgColor },
                  ]}
                >
                  {item.icon}
                </View>

                {/* Texto da Opção */}
                <Typo size={18} fontWeight={"500"} style={{ flex: 1 }}>
                  {item.title}
                </Typo>

                {/* Seta de Navegação */}
                <FontAwesome6 name="chevron-right" size={14} color="#555" />
              </TouchableOpacity>

              {/* Linha Divisória (exceto no último item) */}
              {index !== accountOptions.length - 1 && (
                <View style={styles.divider} />
              )}
            </Animated.View>
          ))}
        </View>

        {/* Informação Adicional no Rodapé */}
        <View style={styles.footer}>
          <Typo size={14} color="#666">
            Feito com ❤️ em Luanda
          </Typo>
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
  sectionContainer: {
    backgroundColor: "#1A1A1A", // Um pouco mais claro que o fundo principal para contraste
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#262626",
    overflow: "hidden",
    marginTop: verticalScale(20),
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    gap: scale(15),
  },
  iconWrapper: {
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#262626",
    marginLeft: scale(65), // Alinha com o início do texto, saltando o ícone
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingBottom: verticalScale(30),
  },
});
