import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import CustomAlert from "@/components/CustomAlert";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthProvider";
import * as schema from "@/db/schema";
import { getProfileImage } from "@/services/imageService";
import { updateUser } from "@/services/userService";
import { UserDataType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

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

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

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

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1], // Foto de perfil deve ser quadrada
      quality: 0.5,
    });

    if (!result.canceled)
      setUserData({ ...userData, image: result.assets[0].uri });
  };

  const onSubmit = async () => {
    let { name } = userData;
    if (!name.trim()) {
      showAlert("Erro", "O nome não pode estar vazio.");
      return;
    }
    setLoading(true);

    const res = await updateUser(drizzleDb, user?.uid as string, {
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
      <View style={styles.container}>
        <Header
          title="Actualizar Perfil"
          leftIcon={<BackButton />}
          style={{ marginBottom: verticalScale(20) }}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Secção da Imagem de Perfil */}
          <View style={styles.imageSection}>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={getProfileImage(userData.image)}
                transition={200}
                contentFit="cover"
              />
              <TouchableOpacity
                onPress={onPickImage}
                activeOpacity={0.8}
                style={styles.editButton}
              >
                <FontAwesome6 name="camera" size={scale(18)} color="#fff" />
              </TouchableOpacity>
            </View>
            <Typo size={14} color="#888">
              Toca na câmara para mudar a foto
            </Typo>
          </View>

          {/* Secção do Formulário */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Typo size={16} fontWeight="600">
                Nome Completo
              </Typo>
              <Input
                placeholder="Ex: Manuel Silva"
                value={userData.name}
                onChangeText={(value) =>
                  setUserData({ ...userData, name: value })
                }
              />
            </View>

            <Typo size={13} color="#555" style={{ textAlign: "center" }}>
              Esta informação será visível nos teus relatórios e extratos.
            </Typo>
          </View>
        </ScrollView>
      </View>

      {/* Botão de Acção Fixo no Rodapé */}
      <View style={styles.footer}>
        <Button
          onPress={onSubmit}
          loading={loading}
          style={styles.submitButton}
        >
          <Typo fontWeight="700" color="#fff" size={16}>
            Guardar Alterações
          </Typo>
        </Button>
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  scrollContent: {
    paddingBottom: verticalScale(30),
  },
  imageSection: {
    alignItems: "center",
    gap: verticalScale(15),
    marginVertical: verticalScale(20),
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    height: verticalScale(140),
    width: verticalScale(140),
    borderRadius: 70,
    backgroundColor: "#262626",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  editButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: Colors.primary,
    height: scale(40),
    width: scale(40),
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#1A1A1A",
  },
  form: {
    gap: verticalScale(20),
    marginTop: verticalScale(10),
  },
  inputGroup: {
    gap: verticalScale(10),
  },
  footer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(30),
    borderTopWidth: 1,
    borderTopColor: "#262626",
  },
  submitButton: {
    height: verticalScale(54),
    borderRadius: 16,
  },
});
