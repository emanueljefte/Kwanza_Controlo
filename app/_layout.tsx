import { Stack } from "expo-router";

import { AuthProvider, useAuth } from "@/contexts/AuthProvider";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WalletProvider } from "@/contexts/walletContext";
import "@/global.css";
import { ForegroundNotification } from "@/services/notificationService";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const InitialLayout = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    ForegroundNotification();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />

        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen
            name="(modals)/profile/index"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/wallet/index"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/transaction/index"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/search/index"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/pin/index"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/category/index"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/notification/index"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/appearance/index"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/transfer/index"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="screens/settings/index"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="screens/notifications/index"
            options={{ presentation: "modal" }}
          />
        </Stack.Protected>
      </Stack>
    </>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DatabaseProvider>
          <AuthProvider>
            <WalletProvider>
              <InitialLayout />
            </WalletProvider>
          </AuthProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
