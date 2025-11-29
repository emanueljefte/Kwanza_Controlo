import { Stack } from "expo-router";

import { AuthProvider } from "@/contexts/AuthProvider";
import "@/global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

const InitialLayout = () => {
  return (
      <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(modals)/profileModal" options={{presentation: "modal"}} />
          
          <Stack.Screen name="(modals)/WalletModal" options={{presentation: "modal"}} />

          <Stack.Screen name="(modals)/transactionModel" options={{presentation: "modal"}} />
      </Stack>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
