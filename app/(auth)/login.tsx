import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import CustomAlert from "@/components/CustomAlert";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthProvider";
import { scale, verticalScale } from "@/utils/styling";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const { login: loginUser } = useAuth();
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "error",
  ) => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const handleSubmit = async () => {
    const regex = /^[^\s]+@[^\s]+\.[^\s]+$/;
    setErrorEmail("");

    if (!emailRef.current || !passwordRef.current) {
      showAlert("Login", "Por favor, preencha todos os campos.");
      return;
    }

    if (!regex.test(emailRef.current)) {
      setErrorEmail("E-mail inválido");
      return;
    }

    setIsLoading(true);
    const res = await loginUser(emailRef.current, passwordRef.current);
    setIsLoading(false);

    if (!res.success) {
      showAlert("Erro de Acesso", res.msg as any);
      return;
    }
    router.replace("/(tabs)");
  };

  return (
    <ScreenWrapper>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Top Bar & Header */}
          <View style={styles.header}>
            <BackButton
              onPress={() => router.push("/(auth)/welcome")}
              iconSize={24}
            />
            <View style={styles.textContainer}>
              <Typo size={32} fontWeight={"800"}>
                Olá,
              </Typo>
              <Typo size={32} fontWeight={"800"} color={Colors.primary}>
                Bem-vindo de Volta
              </Typo>
              <Typo size={16} color="#666" style={{ marginTop: 5 }}>
                Aceda à sua conta para gerir o seu dinheiro.
              </Typo>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View>
              <Input
                placeholder="Introduza o teu e-mail"
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

            <View style={{ gap: verticalScale(12) }}>
              <Input
                placeholder="Introduza a tua Palavra-Passe"
                secureTextEntry
                onChangeText={(value) => (passwordRef.current = value)}
                icon={<Feather name="lock" size={20} />}
              />

              <Pressable
                onPress={() => {
                  /* Lógica de Reset */
                }}
                style={styles.forgotPass}
              >
                <Typo size={14} color="#777" fontWeight={"600"}>
                  Esqueci a Palavra-Passe
                </Typo>
              </Pressable>
            </View>

            <Button
              loading={isLoading}
              onPress={handleSubmit}
              style={styles.loginBtn}
            >
              <Typo fontWeight={"700"} color={"white"} size={18}>
                Entrar
              </Typo>
            </Button>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Typo size={16}>Não tem uma conta?</Typo>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Typo size={16} fontWeight={"700"} color={Colors.primary}>
                {" "}
                Cadastra-se
              </Typo>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  container: {
    flex: 1,
    paddingHorizontal: scale(24),
  },
  scrollContainer: {
    paddingBottom: verticalScale(40),
  },
  header: {
    marginTop: verticalScale(20),
    gap: verticalScale(25),
  },
  textContainer: {
    marginTop: verticalScale(5),
  },
  form: {
    marginTop: verticalScale(40),
    gap: verticalScale(20),
  },
  errorText: {
    marginLeft: scale(5),
    marginTop: verticalScale(5),
  },
  forgotPass: {
    alignSelf: "flex-end",
    paddingVertical: 4,
  },
  loginBtn: {
    marginTop: verticalScale(10),
    // Sombras para profundidade
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
