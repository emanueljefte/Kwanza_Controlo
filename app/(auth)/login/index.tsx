import CustomAlert from "@/components/CustomAlert";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/AuthProvider";
import { router } from "expo-router";
import { useRef, useState } from "react";
import LoginView from "./_loginView";

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

  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");

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
      <LoginView
        errorEmail={errorEmail}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        email={emailRef}
        password={passwordRef}
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
