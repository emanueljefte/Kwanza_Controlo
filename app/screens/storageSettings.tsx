import Typo from "@/components/Typo";
import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import {
    ArrowsCounterClockwiseIcon,
    CloudArrowDownIcon,
    CloudArrowUp
} from "phosphor-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    View,
} from "react-native";

export default function StorageSettings() {
  const [loading, setLoading] = useState<string | null>(null);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const handleBackup = async () => {
    setLoading("backup");
    try {
      // Simulação de chamada ao serviço
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert("Sucesso", "Backup realizado com sucesso na nuvem!");
    } catch (e) {
      Alert.alert("Erro", "Falha ao realizar backup.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <Typo size={18} fontWeight="700" style={styles.title}>
        Dados e Armazenamento
      </Typo>

      <View style={styles.card}>
        {/* BOTÃO BACKUP */}
        <StorageOption
          title="Fazer Backup Agora"
          description="Enviar dados atuais para a nuvem"
          icon={<CloudArrowUp size={22} color="#fff" />}
          bgColor="#0ea5e9"
          onPress={handleBackup}
          loading={loading === "backup"}
        />

        <View style={styles.divider} />

        {/* BOTÃO RECUPERAÇÃO */}
        <StorageOption
          title="Restaurar Dados"
          description="Substituir dados locais pelos da nuvem"
          icon={<CloudArrowDownIcon size={22} color="#fff" />}
          bgColor="#f59e0b"
          onPress={() =>
            Alert.alert(
              "Aviso",
              "Isso apagará seus dados locais atuais. Continuar?",
            )
          }
        />

        <View style={styles.divider} />

        {/* BOTÃO SINCRONIZAÇÃO */}
        <StorageOption
          title="Sincronização Forçada"
          description="Sincronizar pendências imediatamente"
          icon={<ArrowsCounterClockwiseIcon size={22} color="#fff" />}
          bgColor="#10b981"
          onPress={() =>
            Alert.alert("Sincronizando", "Verificando dados pendentes...")
          }
        />
      </View>
    </View>
  );
}

// Sub-componente para os itens da lista
const StorageOption = ({
  title,
  description,
  icon,
  bgColor,
  onPress,
  loading,
}: any) => (
  <Pressable style={styles.option} onPress={onPress} disabled={loading}>
    <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
      {loading ? <ActivityIndicator color="#fff" size="small" /> : icon}
    </View>
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Typo fontWeight="600" size={16}>
        {title}
      </Typo>
      <Typo size={13} color="#888">
        {description}
      </Typo>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  container: { marginTop: 25 },
  title: { marginBottom: 15, marginLeft: 5 },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginLeft: 70,
  },
});
