import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { getProfileImage } from "@/services/imageService";
import { UserDataType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type ProfileModalViewProps = {
  data: UserDataType;
  loading: boolean;
  onPickImage: () => void;
  onSubmit: () => void;
  setData: (value: UserDataType) => void;
};

export default function ProfileModalView({
  data,
  loading,
  onPickImage,
  onSubmit,
  setData,
}: ProfileModalViewProps) {
  return (
    <>
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
                source={getProfileImage(data.image)}
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
                value={data.name}
                onChangeText={(value) => setData({ ...data, name: value })}
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
    </>
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
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  editButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: Colors.dark.primary,
    height: scale(40),
    width: scale(40),
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
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
