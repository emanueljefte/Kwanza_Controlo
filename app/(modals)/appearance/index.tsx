import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { scale, verticalScale } from "@/utils/styling";
import { StyleSheet, Switch, View } from "react-native";

export default function AppearanceModal() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <ModalWrapper>
      <View style={styles.flex1}>
        <Header
          title="Aparência"
          leftIcon={<BackButton />}
          style={{ marginVertical: verticalScale(10) }}
        />

        <View style={styles.content}>
          <Typo color={theme.text} size={16} fontWeight="500">
            Personalize o aspeto visual da sua aplicação.
          </Typo>

          {/* Item de Configuração */}
          <View
            style={[
              styles.itemStyle,
              { backgroundColor: isDark ? "#1A1A1A" : "#F5F5F5" },
            ]}
          >
            <View>
              <Typo fontWeight="600" size={18}>
                Modo Escuro
              </Typo>
              <Typo size={13} color="#888">
                {isDark ? "Ativado" : "Desativado"}
              </Typo>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={Colors.dark.primary}
              // Usando cores que se adaptam melhor ao tema
              trackColor={{
                false: "#333",
                true: Colors.dark.primary + "80", // Cor primária com transparência
              }}
            />
          </View>

          <View style={styles.footer}>
            <Typo color="#666" size={12} style={{ textAlign: "center" }}>
              Modo atual de renderização:{" "}
              <Typo size={12} fontWeight="700" color={Colors.dark.primary}>
                {isDark ? "Escuro" : "Claro"}
              </Typo>
            </Typo>
          </View>
        </View>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  content: {
    marginTop: verticalScale(10),
  },
  footer: {
    marginTop: verticalScale(30),
    opacity: 0.6,
  },
  itemStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
    borderRadius: 16,
    marginTop: verticalScale(20),
  },
});
