import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/AuthProvider";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { login: loginUser } = useAuth();
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Preencha todos os campos");
      return;
    }
    setIsLoading(true);
    const res = await loginUser(emailRef.current, passwordRef.current);
    setIsLoading(false);
    console.log("Register result: ", res);
    if (!res.success) {
      Alert.alert("Sign Up", res.msg);
      return;
    }
    router.replace("/(tabs)");
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScreenWrapper>
        <View
          className="flex-1"
          style={{ gap: verticalScale(30), paddingHorizontal: scale(20) }}
        >
          <BackButton iconSize={28} />
          <View className="gap-1" style={{ marginTop: verticalScale(20) }}>
            <Typo size={30} fontWeight={"800"}>
              Olá
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              Bem-vindo de Volta
            </Typo>
          </View>

          <View style={{ gap: verticalScale(20) }}>
            <Typo size={16} color="#ddd">
              Entre agora para gerir os seus gastos
            </Typo>
            <Input
              placeholder="Introduza o teu e-mail"
              onChangeText={(value) => (emailRef.current = value)}
              icon={
                <FontAwesome
                  name="at"
                  size={verticalScale(26)}
                  color={"#ccc"}
                />
              }
            />
            <Input
              placeholder="Introduza a tua Palavra-Passe"
              secureTextEntry
              onChangeText={(value) => (passwordRef.current = value)}
              icon={
                <FontAwesome
                  name="lock"
                  size={verticalScale(26)}
                  color={"#ccc"}
                />
              }
            />
            <Typo size={14} color="white" style={{ alignSelf: "flex-end" }}>
              Esqueci a Palavra-Passe
            </Typo>
            <Button loading={isLoading} onPress={handleSubmit}>
              <Typo fontWeight={"700"} color="black" size={21}>
                Login
              </Typo>
            </Button>
          </View>

          <View className="flex-row justify-center items-center gap-1">
            <Typo size={15}>Não tem uma conta?</Typo>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Typo size={15} fontWeight={"700"} color="#f97316">
                Sign Up
              </Typo>
            </Pressable>
          </View>
        </View>
      </ScreenWrapper>
    </TouchableWithoutFeedback>
  );
}
