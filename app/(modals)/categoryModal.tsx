import BackButton from "@/components/BackButton";
import { DynamicIcon } from "@/components/dynamicIcon";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { ICON_CATALOG, INCOME_CATALOG } from "@/constants/icons"; // Importe ambos
import { scale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MagnifyingGlassIcon } from "phosphor-react-native";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function CategoryModal() {
  const router = useRouter();
  const { type } = useLocalSearchParams(); // Recebe 'expense' ou 'income'

  const [search, setSearch] = useState(""); // Estado para a busca

  const activeCatalog = type === "income" ? INCOME_CATALOG : ICON_CATALOG;

  // Usamos useMemo para não reprocessar a lista em cada renderização desnecessária
  const filteredData = useMemo(() => {
    const query = search.toLowerCase().trim();

    // Se não houver busca, retorna o catálogo completo com cabeçalhos
    if (!query) {
      return Object.entries(activeCatalog).flatMap(([category, icons]) => [
        { isHeader: true, title: category },
        ...icons.map((icon) => ({ ...icon, isHeader: false })),
      ]);
    }

    // Se houver busca, filtramos apenas os ícones e removemos cabeçalhos vazios
    const results: any[] = [];
    Object.values(activeCatalog)
      .flat()
      .forEach((icon: any) => {
        if (icon.displayName.toLowerCase().includes(query)) {
          results.push({ ...icon, isHeader: false });
        }
      });
    return results;
  }, [search, activeCatalog]);

  // 1. Seleciona o catálogo baseado no tipo

  // 2. Transforma em array plano
  const flattenedData = Object.entries(activeCatalog).flatMap(
    ([category, icons]) => [
      { isHeader: true, title: category },
      ...icons.map((icon) => ({ ...icon, isHeader: false })),
    ],
  );

  const handleSelectedCategory = async (item: any) => {
    // Guardamos o objeto completo para ter acesso ao displayName e ícone depois
    await SecureStore.setItemAsync("category", JSON.stringify(item));
    router.back();
  };

  const renderItemB = ({ item }: { item: any }) => {
    if (item.isHeader) {
      return (
        <View style={styles.headerContainer}>
          <Typo size={16} fontWeight="700" color={Colors.primary}>
            {item.title}
          </Typo>
          <View style={styles.headerLine} />
        </View>
      );
    }

    return (
      <Pressable
        style={styles.categoryCard}
        onPress={() => handleSelectedCategory(item)}
      >
        <View style={styles.iconWrapper}>
          <DynamicIcon
            name={item.name}
            size={26}
            color={"white"}
            weight="fill"
          />
        </View>
        <Typo
          style={{ marginTop: 8, textAlign: "center" }}
          size={12}
          color="#bbb"
          numberOfLines={1}
        >
          {item.displayName}
        </Typo>
      </Pressable>
    );
  };

  return (
    <ModalWrapper>
      <View style={{ paddingHorizontal: scale(20) }}>
        <Header
          title={
            type === "income" ? "Categoria de Renda" : "Categoria de Despesa"
          }
          leftIcon={<BackButton />}
        />

        {/* BARRA DE PESQUISA */}
        <View style={{ marginBottom: 20 }}>
          <Input
            placeholder="Pesquisar categoria..."
            value={search}
            onChangeText={setSearch}
            icon={<MagnifyingGlassIcon size={20} color={Colors.primary} />}
          />
        </View>
      </View>

      <FlashList
        data={filteredData}
        renderItem={renderItemB}
        numColumns={search.length > 0 ? 3 : 3}
        estimatedItemSize={100}
        // Ajuste dinâmico do Span para busca
        overrideItemLayout={(layout, item) => {
          if (item.isHeader) {
            layout.span = 3;
            layout.size = 60;
          }
        }}
        keyExtractor={(item, index) =>
          item.isHeader ? item.title : item.name + index
        }
        contentContainerStyle={{
          paddingHorizontal: scale(16),
          paddingBottom: 40,
        }}
        // Mensagem caso não encontre nada
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Typo color="#666">
              Nenhuma categoria encontrada para "{search}"
            </Typo>
          </View>
        }
      />
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
    marginTop: 4,
  },
  categoryCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    margin: 6,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#262626",
    flex: 1,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
  },
});
