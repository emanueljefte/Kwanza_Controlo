import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons"; // Adicionado FontAwesome6
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
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
type WalletModalViewProps = {
  id: string | string[];
  wallet: Partial<WalletType>;
  loading: boolean;
  onSubmit: () => void;
  setWallet: (value: Partial<WalletType>) => void;
  showDeleteAlert: () => void;
};

export default function WalletModalView({
  id,
  wallet,
  loading,
  setWallet,
  onSubmit,
  showDeleteAlert,
}: WalletModalViewProps) {
  return (
    <View style={styles.container}>
      <Header
        title={id ? "Editar Carteira" : "Nova Carteira"}
        leftIcon={<BackButton />}
        style={{ marginBottom: verticalScale(20) }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollForm}
          keyboardShouldPersistTaps="handled"
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
                    color={
                      wallet.image === icon.name ? Colors.dark.primary : "#888"
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.footer}>
            {id && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={showDeleteAlert}
                disabled={loading}
              >
                <FontAwesome
                  name="trash"
                  color={Colors.dark.warning}
                  size={22}
                />
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  iconCardActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: `${Colors.dark.primary}10`,
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
