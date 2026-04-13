import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { getProfileImage } from "@/services/imageService";
import { accountOptionsType, UserType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type ProfileView = {
  user: UserType;
  accountOptions: accountOptionsType[];
  onPress: (value: accountOptionsType) => void;
};

export default function ProfileView({
  user,
  accountOptions,
  onPress,
}: ProfileView) {
  const { theme } = useTheme();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Perfil" style={{ marginBottom: verticalScale(20) }} />

        {/* Header do Perfil (Avatar + Info) */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={150}
            />
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => router.push("/(modals)/profile")}
            >
              <FontAwesome6 name="camera" size={12} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Typo size={24} fontWeight="700">
              {user?.name || "Utilizador"}
            </Typo>
            <Typo size={14} color="#888">
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* Lista de Opções Estilizada */}
        <View
          style={[styles.optionsWrapper, { backgroundColor: theme.border }]}
        >
          {accountOptions.map((item, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 100).damping(15)}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.optionItem}
                onPress={() => onPress(item)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.bgColor },
                  ]}
                >
                  {item.icon}
                </View>

                <Typo size={17} fontWeight="500" style={{ flex: 1 }}>
                  {item.title}
                </Typo>

                <FontAwesome6 name="chevron-right" size={14} color="#444" />
              </TouchableOpacity>

              {/* Divisor entre itens, exceto no último */}
              {index !== accountOptions.length - 1 && (
                <View style={styles.divider} />
              )}
            </Animated.View>
          ))}
        </View>

        {/* Versão do App ou Copyright ao fundo */}
        <View style={styles.footer}>
          <Typo size={12} color="#444">
            Versão 1.0.2 - Finanças Angola
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
  profileCard: {
    alignItems: "center",
    marginBottom: verticalScale(35),
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: verticalScale(15),
  },
  avatar: {
    height: verticalScale(130),
    width: verticalScale(130),
    borderRadius: 65,
    borderWidth: 2,
    borderColor: "#262626",
  },
  editBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: Colors.dark.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    alignItems: "center",
    gap: 2,
  },
  optionsWrapper: {
    borderRadius: 24,
    paddingVertical: verticalScale(8),
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: verticalScale(14),
    paddingHorizontal: scale(16),
    gap: scale(14),
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#262626",
    marginHorizontal: scale(16),
    marginLeft: scale(60), // Alinha com o início do texto
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingBottom: verticalScale(20),
  },
});
