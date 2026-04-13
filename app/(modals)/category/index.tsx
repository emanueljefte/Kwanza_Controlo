import { ICON_CATALOG, INCOME_CATALOG } from "@/constants/icons";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useMemo, useState } from "react";
import CategoryModalView from "./_categoryModalView";

export default function CategoryModal() {
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

  return (
    <CategoryModalView
      type={type}
      search={search}
      setSearch={setSearch}
      onSelectedCategory={handleSelectedCategory}
      filteredData={filteredData}
    />
  );
}
