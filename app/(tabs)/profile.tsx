import { useAuth } from "@/contexts/AuthProvider";
import { accountOptionsType } from "@/types";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert } from "react-native";
import ProfileView from "../tabsScreens/_profileView";

export default function Profile() {
  const { user, logout } = useAuth();

  const accountOptions: accountOptionsType[] = [
    {
      title: "Editar Perfil",
      icon: <FontAwesome6 name="user-pen" size={20} color={"#fff"} />,
      routeName: "/(modals)/profile",
      bgColor: "#6366f1",
    },
    {
      title: "Notificações",
      icon: <FontAwesome6 name="bell" size={20} color={"#fff"} />,
      routeName: "/screens/notifications",
      bgColor: "#f59e0b",
    },
    {
      title: "Configurações",
      icon: <FontAwesome6 name="gear" size={20} color={"#fff"} />,
      routeName: "/screens/settings",
      bgColor: "#10b981",
    },
    {
      title: "Sair",
      icon: <FontAwesome6 name="power-off" size={20} color={"#fff"} />,
      bgColor: "#e11d48",
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const showLogoutAlert = () => {
    Alert.alert(
      "Confirmação",
      "Tens a certeza que desejas terminar a sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: handleLogout, style: "destructive" },
      ],
    );
  };

  const handlePress = (item: accountOptionsType) => {
    if (item.title === "Sair") {
      showLogoutAlert();
      return;
    }
    if (item.routeName) router.push(item.routeName as any);
  };

  return (
    <ProfileView
      accountOptions={accountOptions}
      onPress={handlePress}
      user={user}
    />
  );
}
