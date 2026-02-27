import { Colors } from "@/constants/colors";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons"; // Atualizado para FontAwesome6
import { Router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Typo from "./Typo";

export default function WalletListItem({
  item,
  index,
  router,
}: {
  item: WalletType;
  index: number;
  router: Router;
}) {
  const colorSchema = useColorScheme();
  const theme = Colors[colorSchema!] ?? Colors.dark;

  const openWallet = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id?.toString(),
        name: item?.name,
        image: item?.image,
      },
    });
  };

  // Função para formatar o saldo individual da carteira
  const formatValue = (val: number) => {
    return new Intl.NumberFormat("pt-AO", {
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).damping(13)}
      style={[
        styles.container,
        { backgroundColor: theme.uiBackground || "#1F1F1F" },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.content}
        onPress={openWallet}
      >
        {/* Container do Ícone (Substituindo a Image) */}
        <View style={styles.iconContainer}>
          <FontAwesome6
            name={item?.image || "wallet"}
            size={scale(20)}
            color={Colors.primary}
          />
        </View>

        {/* Informações da Carteira */}
        <View style={styles.textContainer}>
          <Typo size={17} fontWeight="600">
            {item?.name}
          </Typo>
          <Typo size={14} color="#888">
            {formatValue(item?.amount as number)}{" "}
            <Typo size={12} color={Colors.primary}>
              KZ
            </Typo>
          </Typo>
        </View>

        {/* Indicador de Ação */}
        <View style={styles.arrowContainer}>
          <FontAwesome6 name="chevron-right" size={scale(14)} color="#555" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(12),
    borderRadius: verticalScale(18),
    // Borda sutil para definir o item no dark mode
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: verticalScale(12),
    gap: scale(12),
  },
  iconContainer: {
    height: verticalScale(48),
    width: verticalScale(48),
    borderRadius: verticalScale(14),
    backgroundColor: `${Colors.primary}15`, // Cor primária com baixíssima opacidade
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },
  arrowContainer: {
    paddingHorizontal: scale(4),
  },
});
