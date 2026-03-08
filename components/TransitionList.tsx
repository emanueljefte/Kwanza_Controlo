import { Colors } from "@/constants/colors";
import { findCategoryInCatalog } from "@/constants/icons";
import { useTheme } from "@/contexts/ThemeContext";
import {
  TransactionItemProps,
  TransactionListType,
  TransactionType,
} from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Loading from "./Loading";
import Typo from "./Typo";

export default function TransitionList({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) {
  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModel",
      params: {
        ...item,
        amount: item.amount.toString(),
        date:
          typeof item.date === "string" ? item.date : item.date.toISOString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.headerRow}>
          <Typo size={19} fontWeight={"700"}>
            {title}
          </Typo>
          <TouchableOpacity>
            <Typo size={14} color={Colors.primary} fontWeight={"600"}>
              Ver tudo
            </Typo>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.list}>
        <FlashList<TransactionType>
          data={data}
          keyExtractor={(item, index) =>
            item.id?.toString() ?? index.toString()
          }
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
        />
      </View>

      {!loading && data.length === 0 && (
        <View style={styles.emptyContainer}>
          <Typo size={15} color="#888">
            {emptyListMessage}
          </Typo>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      )}
    </View>
  );
}

export const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  const { theme } = useTheme();
  const themeColors = Colors[theme!] ?? Colors.dark;

  // Busca o ícone e o nome de exibição no catálogo baseado no item.category (que guarda o 'name')
  const categoryInfo = React.useMemo(() => {
    // Garante que o tipo seja passado corretamente
    const type = item.type === "income" ? "income" : "expense";
    return findCategoryInCatalog(item.category || "", type);
  }, [item.category, item.type]);

  // Renomeia para letra maiúscula para o React entender como Componente
  const IconComponent = categoryInfo.comp;

  // Formatação de data e valor
  const date = item?.date
    ? new Date(item.date).toLocaleDateString("pt-AO", {
        day: "numeric",
        month: "short",
      })
    : "";
  const formattedAmount = Number(item.amount).toLocaleString("pt-AO", {
    minimumFractionDigits: 2,
  });

  // Cor de destaque (Pode vir do DB ou ser fixa por tipo)
  const brandColor = item.type === "income" ? "#10b981" : "#ef4444";

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).damping(15)}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.row, { backgroundColor: themeColors.uiBackground }]}
        onPress={() => handleClick(item)}
      >
        {/* ÍCONE DINÂMICO DO PHOSPHOR */}
        <View style={[styles.icon, { backgroundColor: brandColor + "15" }]}>
          <IconComponent
            size={verticalScale(22)}
            color={brandColor}
            weight="fill"
          />
        </View>

        <View style={styles.categoryDes}>
          <Typo size={16} fontWeight="600">
            {categoryInfo.displayName}
          </Typo>
          <Typo size={13} color="#888" textProps={{ numberOfLines: 1 }}>
            {item?.description || "Sem descrição"}
          </Typo>
        </View>

        <View style={styles.amountDate}>
          <Typo fontWeight={"700"} size={15} color={brandColor}>
            {item?.type === "income" ? "+ " : "- "}
            {formattedAmount}
          </Typo>
          <Typo size={12} color="#999">
            {date}
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(20),
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  list: {
    flex: 1,
    minHeight: 100,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: verticalScale(12),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.13)",
    marginBottom: verticalScale(10),
    // Sombra leve para efeito de card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    height: verticalScale(48),
    width: verticalScale(48),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  categoryDes: {
    flex: 1,
    marginLeft: scale(12),
    gap: 2,
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 2,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center",
  },
});
