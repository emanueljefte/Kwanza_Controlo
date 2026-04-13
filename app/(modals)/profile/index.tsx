import CustomAlert from "@/components/CustomAlert";
import ModalWrapper from "@/components/ModalWrapper";
import { useAuth } from "@/contexts/AuthProvider";
import { updateUser } from "@/services/userService";
import { UserDataType } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import ProfileModalView from "./_profileModalView";

export default function ProfileModal() {
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null,
    });
  }, [user]);

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "error",
  ) => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1], // Foto de perfil deve ser quadrada
      quality: 0.5,
    });

    if (!result.canceled)
      setUserData({ ...userData, image: result.assets[0].uri });
  };

  const handleSubmit = async () => {
    let { name } = userData;
    if (!name.trim()) {
      showAlert("Erro", "O nome não pode estar vazio.");
      return;
    }
    setLoading(true);

    const res = await updateUser(user?.uid as string, {
      ...userData,
      name: name.trim(),
    });

    if (res.success) {
      setUser(userData);
      router.replace("/(tabs)/profile");
    } else {
      setLoading(false);
      showAlert("Erro", res.msg as string);
    }
  };

  return (
    <ModalWrapper>
      <ProfileModalView
        data={userData}
        setData={setUserData}
        loading={loading}
        onPickImage={handlePickImage}
        onSubmit={handleSubmit}
      />
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </ModalWrapper>
  );
}
