import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/AuthProvider";
import { getProfileImage } from "@/services/imageService";
import { accountOptionsType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const accountOptions: accountOptionsType[] = [
    {
      title: "Editar Perfil",
      icon: <FontAwesome name="user" size={26} color={"#fff"} />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Configurações",
      icon: <FontAwesome name="gear" size={26} color={"#fff"} />,
      // routeName: "/(modals)/profileModal",
      bgColor: "#059669",
    },
    {
      title: "Políticas de Privacidade",
      icon: <FontAwesome name="lock" size={26} color={"#fff"} />,
      // routeName: "/(modals)/profileModal",
      bgColor: "#ccc",
    },
    {
      title: "Sair",
      icon: <FontAwesome name="power-off" size={26} color={"#fff"} />,
      // routeName: "/(modals)/profileModal",
      bgColor: "#e11d48",
    },
  ];
  
  const handleLogout = async () => {
    // await signOut(auth)
    await logout();
  };

  const showLogoutAlert = () => {
    Alert.alert("Confirmação", "Tens a certeza que desejas deslogar?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Deslogar cancelado"),
        style: "cancel",
      },
      {
        text: "Deslogar",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };

  const handlePress = (item: accountOptionsType) => {
    if (item.title == "Sair") {
      showLogoutAlert();
    }

    if (item.routeName) {
      router.push(item.routeName);
    }
  };
  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ paddingHorizontal: scale(20) }}>
        <Header title="Perfil" style={{ marginVertical: verticalScale(10) }} />

        <View
          className="items-center"
          style={{ marginTop: verticalScale(30), gap: verticalScale(15) }}
        >
          <View className="" style={{}}>
            <Image
              source={getProfileImage(user?.image)}
              className="self-center bg-neutral-300 rounded-[200px]"
              style={{ height: verticalScale(135), width: verticalScale(135) }}
              contentFit="cover"
              transition={100}
            />
          </View>
          {user && (
            <View className="items-center" style={{ gap: verticalScale(4) }}>
              <Typo size={24} fontWeight={"600"} color="#ddd">
                {user.name}{" "}
              </Typo>
              <Typo size={15} fontWeight={"600"} color="#ccc">
                {user.email}
              </Typo>
            </View>
          )}
        </View>
        <View style={{ marginTop: verticalScale(35) }}>
          {accountOptions.map((item, index) => (
            <Animated.View
              key={index.toString()}
              entering={FadeInDown.delay(index * 50)
                .springify()
                .damping(14)}
              style={{ marginBottom: verticalScale(17) }}
            >
              <TouchableOpacity
                className="flex-row items-center"
                style={{ gap: scale(10) }}
                onPress={() => handlePress(item)}
              >
                <View
                  className="bg-neutral-500 items-center justify-center"
                  style={{
                    height: verticalScale(44),
                    width: verticalScale(44),
                    borderRadius: verticalScale(15),
                    borderCurve: "continuous",
                    backgroundColor: item?.bgColor,
                  }}
                >
                  {item.icon && item.icon}
                </View>
                <Typo size={26} style={{ flex: 1 }} fontWeight={"500"}>
                  {item.title}
                </Typo>
                <FontAwesome
                  name="caret-right"
                  size={verticalScale(20)}
                  color={"#fff"}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}
