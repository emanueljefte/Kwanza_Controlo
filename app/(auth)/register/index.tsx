import CustomAlert from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthProvider";
import { scale, verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import RegisterView from "./_registerView";

export default function Register() {
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const { register: registerUser } = useAuth();
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");
  const nameRef = useRef<string>("");

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

    setErrors({ password: "", email: "" });

    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      showAlert("Cadastro", "Por favo, preencha todos os campos.");
      return;
    }

    if (!regex.test(emailRef.current)) {
      setErrors({ ...errors, email: "Formato de e-mail inválido" });
      return;
    }

    if (!passwordRegex.test(passwordRef.current)) {
      setErrors({
        ...errors,
        password:
          "A senha deve ter pelo menos 6 caracteres, incluindo letras e números.",
      });
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
      <RegisterView
        name={nameRef}
        email={emailRef}
        password={passwordRef}
        errors={errors}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
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
    shadowColor: Colors.dark.primary,
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
