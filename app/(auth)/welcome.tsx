import Button from "@/components/ButtonLayout";
import Typo from "@/components/Typo";
import { scale, verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function Welcome() {
  const router = useRouter()
  return (
    <ScreenWrapper>
      <View className="flex-1 justify-between" style={{paddingTop: verticalScale(7)}}>
        <View>
          <TouchableOpacity className="items-end" style={{marginRight: scale(20)}} onPress={() => router.push("/(auth)/login")}>
            <Typo fontWeight={600}>Sign in</Typo>
          </TouchableOpacity>
          
          <Animated.Image
            entering={FadeIn.duration(2000)}
            source={require("@/assets/images/logo.png")}
            resizeMode="contain"
            className={`w-full items-center`}
            style={{height: verticalScale(300), marginTop: verticalScale(100)}}
          />
        </View>

        <View className={`bg-neutral-900 items-center`} style={styles.footer}>
            <Animated.View entering={FadeInDown.duration(1000).springify().damping(12)} className="items-center">
                <Typo size={24} fontWeight={"700"}>Sempre esteja no controlo</Typo>
                <Typo size={24} fontWeight={"700"}>das suas finanças</Typo>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(1000).delay(100).springify().damping(12)} className="items-center gap-2">
                <Typo size={20} color="#aaa" style={{textAlign: "center"}}>Finanças bem organizadas para melhor</Typo>
                <Typo size={20} color="#aaa">estilo de vida no futuro</Typo>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(1000).delay(200).springify().damping(12)} className="w-full" style={{paddingHorizontal: scale(25)}}>
                <Button onPress={() => router.push("/(auth)/register")}>
                    <Typo size={22} color="#ddd" fontWeight={"700"}>Começar</Typo>
                </Button>
            </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingTop: verticalScale(20), 
    paddingBottom: verticalScale(55),
    gap: verticalScale(20),
    shadowColor: "#fff",
    
    shadowOffset: {width: 0, height: -10},
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
    borderCurve: "continuous"
  }
})
