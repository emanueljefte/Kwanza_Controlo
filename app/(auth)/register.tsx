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
  View
} from "react-native";

export default function Register() {
  const [isLoading, setLoading] = useState(false)
  const {register: registerUser} = useAuth()
  const emailRef = useRef("")
  const passwordRef = useRef("")
  const nameRef = useRef("")

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign Up", "Preencha todos os campos")
      return
    }
    setLoading(true)
    const res = await registerUser(emailRef.current, passwordRef.current, nameRef.current
    )
    setLoading(false)
    console.log("Register result: ", res);
    if (!res.success) {Alert.alert("Sign Up", res.msg)
      return
    }
    router.replace("/(auth)/login")
    
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

    <ScreenWrapper>
      <View className="flex-1" style={{gap: verticalScale(30), paddingHorizontal: scale(20)}}>
        <BackButton iconSize={28} />
        <View className="gap-1" style={{marginTop: verticalScale(20)}}>
          <Typo size={30} fontWeight={"800"}>Vamos</Typo>
          <Typo size={30} fontWeight={"800"}>Começar?</Typo>
        </View>

        <View style={{gap: verticalScale(20)}}>
          <Typo size={16} color="#ddd">Crie uma conta para gerir os seus gastos</Typo>
          <Input placeholder="Introduza o teu nome" onChangeText={value => (nameRef.current = value)} icon={<FontAwesome name="user" size={verticalScale(26)} color={"#ccc"}/>} />
          <Input placeholder="Introduza o teu e-mail" onChangeText={value => (emailRef.current = value)} icon={<FontAwesome name="at" size={verticalScale(26)} color={"#ccc"}/>} />
          <Input placeholder="Introduza a tua Palavra-Passe" secureTextEntry  onChangeText={value => (passwordRef.current = value)} icon={<FontAwesome name="lock" size={verticalScale(26)} color={"#ccc"}/>} />

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"700"} color="black" size={21}>Sign Up</Typo>
          </Button>
        </View>

        <View className="flex-row justify-center items-center gap-1">
          <Typo size={15}>Já tens uma conta?</Typo>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Typo size={15} fontWeight={"700"} color="#f97316">Login</Typo>
          </Pressable>
        </View>
        
      </View>
    </ScreenWrapper>
    </TouchableWithoutFeedback>
  );
}
