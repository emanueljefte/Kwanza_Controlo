import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthProvider";
import * as schema from "@/db/schema";
import { createOrUpdateWallet } from "@/services/walletService";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons"; // Adicionado FontAwesome6
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Lista de ícones sugeridos para carteiras
const WALLET_ICONS = [
  { name: "bank", library: "FontAwesome6" },
  { name: "wallet", library: "FontAwesome6" },
  { name: "money-bill-1", library: "FontAwesome6" },
  { name: "credit-card", library: "FontAwesome6" },
  { name: "piggy-bank", library: "FontAwesome6" },
  { name: "store", library: "FontAwesome6" },
];

export default function WalletModal() {
  const { user } = useAuth();
  const router = useRouter();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const { id, name, image } = useLocalSearchParams();

  const [wallet, setWallet] = useState<Partial<WalletType>>({
    name: "",
    image: "bank", // Agora usaremos o nome do ícone aqui
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 2. Verifique se o ID existe e se o estado atual ainda está vazio
    // para evitar sobrescrever alterações do usuário
    if (id && !wallet.name) {
      setWallet({
        name: name as string,
        image: (image as string) || "bank",
      });
    }
  }, [id, name, image]);

  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name?.trim() || !image) {
      Alert.alert("Carteira", "Por favor, dê um nome à sua carteira");
      return;
    }

    const data: WalletType = {
      name,
      image,
      user: user?.uid,
    };

    if (id) data.id = Number(id);

    setLoading(true);
    const res = await createOrUpdateWallet(drizzleDb, data);
    setLoading(false);

    if (res.success) router.back();
    else Alert.alert("Erro", res.msg);
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={id ? "Editar Carteira" : "Nova Carteira"}
          leftIcon={<BackButton />}
          style={{ marginBottom: verticalScale(20) }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollForm}
        >
          {/* Nome da Carteira */}
          <View style={styles.inputGroup}>
            <Typo size={16} fontWeight="600">
              Nome da Carteira
            </Typo>
            <Input
              placeholder="Ex: Salário, Poupança..."
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>

          {/* Seleção de Ícone */}
          <View style={styles.inputGroup}>
            <Typo size={16} fontWeight="600">
              Selecione um Ícone
            </Typo>
            <View style={styles.iconGrid}>
              {WALLET_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon.name}
                  onPress={() => setWallet({ ...wallet, image: icon.name })}
                  style={[
                    styles.iconCard,
                    wallet.image === icon.name && styles.iconCardActive,
                  ]}
                >
                  <FontAwesome6
                    name={icon.name}
                    size={24}
                    color={wallet.image === icon.name ? Colors.primary : "#888"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Rodapé de Ações */}
        <View style={styles.footer}>
          {id && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                /* lógica de delete alert */
              }}
              disabled={loading}
            >
              <FontAwesome name="trash" color={Colors.warning} size={22} />
            </TouchableOpacity>
          )}

          <Button
            onPress={onSubmit}
            loading={loading}
            style={styles.submitButton}
          >
            <Typo fontWeight="700" color="#fff" size={16}>
              {id ? "Salvar Alterações" : "Criar Carteira"}
            </Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  scrollForm: {
    gap: verticalScale(25),
    paddingBottom: 40,
  },
  inputGroup: {
    gap: verticalScale(12),
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(12),
    marginTop: 5,
  },
  iconCard: {
    width: scale(60),
    height: scale(60),
    borderRadius: 16,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  iconCardActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`, // Cor primária com 10% de opacidade
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: "#262626",
    marginBottom: verticalScale(10),
  },
  submitButton: {
    flex: 1,
    height: verticalScale(52),
    borderRadius: 16,
  },
  deleteButton: {
    width: verticalScale(52),
    height: verticalScale(52),
    borderRadius: 16,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
});
