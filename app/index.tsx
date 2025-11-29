import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      router.push("/(auth)/welcome")
    }, 2000);
  }, [])

  return (
    <SafeAreaView>
      <View className="flex-1 justify-center items-center bg-neutral-500">
        <Image resizeMode="contain" source={require("../assets/images/logo.png")} className="aspect-auto h-[20%]"/>
      </View>
    </SafeAreaView>
  );
}
