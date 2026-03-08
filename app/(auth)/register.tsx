import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import CustomAlert from "@/components/CustomAlert";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthProvider";
import { scale, verticalScale } from "@/utils/styling";
import { Feather } from "@expo/vector-icons"; // Ícones mais modernos
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function Register() {
  const [isLoading, setLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const { register: registerUser } = useAuth();
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "error",
  ) => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const handleSubmit = async () => {
    const regex = /^[^\s]+@[^\s]+\.[^\s]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    setErrorEmail("");
    setErrorPassword("");

    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      showAlert("Cadastro", "Por favor, preencha todos os campos.");
      return;
    }

    if (!regex.test(emailRef.current)) {
      setErrorEmail("Formato de e-mail inválido");
      return;
    }

    if (!passwordRegex.test(passwordRef.current)) {
      showAlert(
        "Senha Fraca",
        "A senha deve ter pelo menos 6 caracteres, incluindo letras e números.",
      );
      return;
    }

    setLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current.trim(),
    );
    setLoading(false);

    if (!res.success) {
      showAlert("Erro no Registro", res.msg as any);
      return;
    }
    setTimeout(() => {
      showAlert("Registro", "Usuário Cadastrado com sucesso", "success");
      router.replace("/(auth)/login");
    }, 2000);
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <BackButton
              onPress={() => router.push("/(auth)/welcome")}
              iconSize={24}
            />
            <View style={styles.titleContainer}>
              <Typo size={32} fontWeight={"800"}>
                Vamos
              </Typo>
              <Typo size={32} fontWeight={"800"} color={Colors.primary}>
                Começar!
              </Typo>
              <Typo size={16} color="#666" style={{ marginTop: 5 }}>
                Crie sua conta e assuma o controle hoje.
              </Typo>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <Input
              placeholder="Nome completo"
              onChangeText={(value) => (nameRef.current = value)}
              icon={<Feather name="user" size={20} />}
            />

            <View>
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(value) => (emailRef.current = value)}
                icon={<Feather name="mail" size={20} />}
              />
              {errorEmail ? (
                <Typo color={Colors.warning} size={13} style={styles.errorText}>
                  {errorEmail}
                </Typo>
              ) : null}
            </View>

            <View>
              <Input
                placeholder="Palavra-Passe"
                secureTextEntry
                onChangeText={(value) => (passwordRef.current = value)}
                icon={<Feather name="lock" size={20} />}
              />
              {errorPassword ? (
                <Typo color={Colors.warning} size={13} style={styles.errorText}>
                  {errorPassword}
                </Typo>
              ) : null}
            </View>

            <Button
              loading={isLoading}
              onPress={handleSubmit}
              style={styles.submitBtn}
            >
              <Typo fontWeight={"700"} color="white" size={18}>
                Criar Conta
              </Typo>
            </Button>
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <Typo size={16}>Já tens uma conta?</Typo>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Typo size={16} fontWeight={"700"} color={Colors.primary}>
                {" "}
                Entrar
              </Typo>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(40),
  },
  header: {
    marginTop: verticalScale(20),
    gap: verticalScale(20),
  },
  titleContainer: {
    marginTop: verticalScale(10),
  },
  form: {
    marginTop: verticalScale(40),
    gap: verticalScale(16),
  },
  errorText: {
    marginLeft: scale(5),
    marginTop: verticalScale(4),
  },
  submitBtn: {
    marginTop: verticalScale(10),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(30),
  },
});
