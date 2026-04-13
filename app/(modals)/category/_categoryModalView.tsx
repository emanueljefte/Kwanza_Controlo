import BackButton from "@/components/BackButton";
import { DynamicIcon } from "@/components/dynamicIcon";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { scale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import { MagnifyingGlassIcon } from "phosphor-react-native";
import { Pressable, StyleSheet, View } from "react-native";

type CategoryModalViewProps = {
  type: string | string[];
  search: string;
  filteredData: any[];
  setSearch: (value: string) => void;
  onSelectedCategory: (value: any) => void;
};

export default function CategoryModalView({
  type,
  search,
  filteredData,
  setSearch,
  onSelectedCategory,
}: CategoryModalViewProps) {
  const { theme } = useTheme();

  const renderItemB = ({ item }: { item: any }) => {
    if (item.isHeader) {
      return (
        <View style={styles.headerContainer}>
          <Typo size={16} fontWeight="700" color={Colors.dark.primary}>
            {item.title}
          </Typo>
          <View style={styles.headerLine} />
        </View>
      );
    }

    return (
      <Pressable
        style={[styles.categoryCard, { backgroundColor: theme.navBackground }]}
        onPress={() => onSelectedCategory(item)}
      >
        <View style={[styles.iconWrapper]}>
          <DynamicIcon
            name={item.name}
            size={26}
            color={theme.iconColorFocused}
            weight="fill"
          />
        </View>
        <Typo
          style={{ marginTop: 8, textAlign: "center" }}
          size={12}
          color="#bbb"
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
        <View style={{ marginTop: 10, marginBottom: 20 }}>
          <Input
            placeholder="Pesquisar categoria..."
            value={search}
            onChangeText={setSearch}
            icon={<MagnifyingGlassIcon size={20} color={Colors.dark.primary} />}
          />
        </View>
      </View>

      <FlashList
        data={filteredData}
        renderItem={renderItemB}
        numColumns={search.length > 0 ? 3 : 3}
        // Ajuste dinâmico do Span para busca
        overrideItemLayout={(layout, item) => {
          if (item.isHeader) {
            layout.span = 3;
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
