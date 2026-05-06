import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Input from "@/components/Input";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { scale, verticalScale } from "@/utils/styling";
import { Feather } from "@expo/vector-icons"; // Ícones mais modernos
import { router } from "expo-router";
import { RefObject } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

type RegisterViewPops = {
  name: RefObject<string>;
  email: RefObject<string>;
  password: RefObject<string>;
  errors: { email: string | null; password: string | null };
  isLoading: boolean;
  onSubmit: () => void;
};

export default function RegisterView({
  name,
  email,
  password,
  errors,
  isLoading,
  onSubmit,
}: RegisterViewPops) {
  return (
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
            <Typo size={32} fontWeight={"800"} color={Colors.dark.primary}>
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
            onChangeText={(value) => (name.current = value)}
            icon={<Feather name="user" size={20} />}
          />

          <View>
            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(value) => (email.current = value)}
              icon={<Feather name="mail" size={20} />}
            />
            {errors.email ? (
              <Typo
                color={Colors.dark.warning}
                size={13}
                style={styles.errorText}
              >
                {errors.email}
              </Typo>
            ) : null}
          </View>

          <View>
            <Input
              placeholder="Palavra-Passe"
              secureTextEntry
              onChangeText={(value) => (password.current = value)}
              icon={<Feather name="lock" size={20} />}
            />
            {errors.password ? (
              <Typo
                color={Colors.dark.warning}
                size={13}
                style={styles.errorText}
              >
                {errors.password}
              </Typo>
            ) : null}
          </View>

          <Button
            loading={isLoading}
            onPress={onSubmit}
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
            <Typo size={16} fontWeight={"700"} color={Colors.dark.primary}>
              {" "}
              Entrar
            </Typo>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
