import Typo from "@/components/Typo";

import migrations from "@/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import React from "react";

import { db } from "@/db";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const { success, error } = useMigrations(db, migrations);

  if (error) return <Typo>Erro na migração: {error.message}</Typo>;

  // Só libera o app quando as migrações E o seed (se necessário) terminarem
  if (!success) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F97316" />
        <Typo color="#F97316" size={18} style={{ marginTop: 15 }}>
          Preparando alicerces...
        </Typo>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0B0E14",
    justifyContent: "center",
    alignItems: "center",
  },
});
