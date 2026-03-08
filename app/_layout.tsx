import { Stack } from "expo-router";

import { AuthProvider, useAuth } from "@/contexts/AuthProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import migrations from "@/drizzle/migrations";
import "@/global.css";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const InitialLayout = () => {
  const { isAuthenticated } = useAuth();

  const [appReady, setAppReady] = useState(false);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />

        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen
            name="(modals)/profileModal"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/walletModal"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/transactionModel"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/searchModal"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/pinModal"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/categoryModal"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/notificationsModal"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="(modals)/apearenceModal"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="screens/settings"
            options={{ presentation: "modal" }}
          />

          <Stack.Screen
            name="screens/notifications"
            options={{ presentation: "modal" }}
          />
        </Stack.Protected>
      </Stack>
    </>
  );
};

export const DATABASE_NAME = "finance_app.db";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Suspense fallback={<ActivityIndicator size={"large"} />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense
        >
          <DrizzleAndMigrationsWrapper />
        </SQLiteProvider>
      </Suspense>
    </SafeAreaProvider>
  );
}

function DrizzleAndMigrationsWrapper() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  if (!success) {
    // Você pode exibir um erro ou fallback aqui
    return <ActivityIndicator size="large" />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
