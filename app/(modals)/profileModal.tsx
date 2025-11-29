import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/AuthProvider";
import { getProfileImage } from "@/services/imageService";
import { updateUser } from "@/services/userService";
import { UserDataType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
export default function profileModal() {
  const {user, updateUserData }=useAuth()
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null
    })
  }, [])

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5
    })

    if (!result.canceled) setUserData({...userData, image: result.assets[0].uri})
  }

  const onSubmit = async () => {
    let { name, image } = userData;
    if (!name.trim()) {
      Alert.alert("Usuário", "Por favor Preencha todos os campos");
      return
    }
    setLoading(true)
    
    const res = await updateUser(user?.uid as string, userData)
    setLoading(false)
    if (res.success) {
      updateUserData(user?.uid as string)
      router.back()
    } else {
      Alert.alert("Usuário", res.msg)
    }
  };

  return (
    <ModalWrapper>
      <View
        style={{ paddingHorizontal: verticalScale(20) }}
        className="flex-1 justify-between"
      >
        <Header
          title="Actualizar Perfil"
          leftIcon={<BackButton />}
          style={{ marginBottom: verticalScale(10) }}
        />

        <ScrollView
          contentContainerStyle={{
            gap: verticalScale(30),
            marginTop: verticalScale(15),
          }}
        >
          <View className="relative self-center">
            <Image
              style={{ height: verticalScale(135), width: verticalScale(135) }}
              className="self-center bg-neutral-300 rounded-[200px] border border-neutral-500"
              source={getProfileImage(userData.image)}
              transition={100}
              contentFit="cover"
            />

            <TouchableOpacity onPress={onPickImage}
              style={{
                bottom: verticalScale(5),
                right: verticalScale(7),
                shadowColor: "000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 4,
                padding: verticalScale(7),
              }}
              className="bg-neutral-100 rounded-[100px] absolute"
            >
              <FontAwesome
                name="pencil"
                size={verticalScale(20)}
                color={"aaa"}
              />
            </TouchableOpacity>
          </View>

          <View style={{ gap: verticalScale(10) }}>
            <Typo color={"#444"}>Nome</Typo>
            <Input
              placeholder="Nome"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          paddingHorizontal: scale(20),
          paddingTop: verticalScale(15),
          marginBottom: verticalScale(55),
          gap: scale(12),
        }}
        className="items-center flex-row justify-center border-t-neutral-700 border-t"
      >
        <Button onPress={onSubmit} loading={loading} style={{flex: 1}} >
          <Typo color="#000" fontWeight={"700"}>
            Actualizar
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
}
