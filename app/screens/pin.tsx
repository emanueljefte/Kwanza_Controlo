import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { SecurityService } from "@/services/SecurityService";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Pin() {
  const [pin, setPin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchPin = async () => {
      const pinExists = await SecurityService.hasPin();
      setPin(pinExists);
      setLoading(false);
    };
    searchPin();
  }, []);

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Segurança"
          leftIcon={<BackButton />}
          style={{ marginBottom: verticalScale(10) }}
        />

        <View style={styles.content}>
          {/* Ícone de Destaque */}
          <View style={styles.iconCircle}>
            <FontAwesome6
              name={pin ? "shield-halved" : "lock"}
              size={scale(50)}
              color={Colors.primary}
            />
          </View>

          {/* Texto Informativo */}
          <View style={styles.textContainer}>
            <Typo size={22} fontWeight="700" style={styles.title}>
              {pin ? "PIN Ativo" : "Proteger com PIN"}
            </Typo>
            <Typo color="#888" style={styles.description}>
              {pin
                ? "O seu acesso está protegido. Pode alterar o seu código de 4 dígitos ou remover a proteção a qualquer momento."
                : "Defina um código de 4 dígitos para garantir que apenas você tenha acesso às suas finanças."}
            </Typo>
          </View>

          {/* Ações */}
          <View style={styles.buttonContainer}>
            {pin ? (
              <>
                <Button
                  onPress={() => router.push("/(modals)/pinModal")}
                  style={styles.mainButton}
                >
                  <Typo fontWeight="600" color="#fff">
                    Alterar PIN Atual
                  </Typo>
                </Button>

                <TouchableOpacity
                  onPress={() => router.push("/(modals)/removalPinModal")}
                  style={styles.removeButton}
                >
                  <Typo color={Colors.warning} fontWeight="600">
                    Remover Proteção
                  </Typo>
                </TouchableOpacity>
              </>
            ) : (
              <Button
                onPress={() => router.push("/(modals)/pinModal")}
                style={styles.mainButton}
              >
                <Typo fontWeight="600" color="#fff">
                  Definir Código PIN
                </Typo>
              </Button>
            )}
          </View>
        </View>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: verticalScale(40),
  },
  iconCircle: {
    height: scale(120),
    width: scale(120),
    borderRadius: scale(60),
    backgroundColor: `${Colors.primary}10`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(30),
    borderWidth: 1,
    borderColor: `${Colors.primary}20`,
  },
  textContainer: {
    alignItems: "center",
    gap: verticalScale(10),
    marginBottom: verticalScale(40),
  },
  title: {
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: scale(10),
  },
  buttonContainer: {
    width: "100%",
    gap: verticalScale(15),
  },
  mainButton: {
    width: "100%",
    height: verticalScale(52),
    borderRadius: 16,
  },
  removeButton: {
    width: "100%",
    height: verticalScale(52),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
});
