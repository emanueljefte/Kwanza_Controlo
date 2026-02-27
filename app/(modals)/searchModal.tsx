import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import TransitionList from "@/components/TransitionList";
import Typo from "@/components/Typo"; // Certifique-se de importar o Typo
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthProvider";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useFocusEffect } from "expo-router";
import { MagnifyingGlass, XCircle } from "phosphor-react-native";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function SearchModal() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Referência para focar o input automaticamente
  const inputRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
      // Pequeno delay para garantir que o modal abriu antes de focar
      setTimeout(() => inputRef.current?.focus(), 100);
    }, []),
  );

  const { data: allTransaction, loading: transactionLoading } =
    useFetchData<TransactionType>(
      "transactions",
      { uid: user?.uid as string, orderBy: "date", sort: "desc" },
      refreshKey,
    );

  const filteredTransaction = allTransaction.filter((item) => {
    if (search.length > 1) {
      const s = search.toLowerCase();
      return (
        item.category?.toLowerCase()?.includes(s) ||
        item.type?.toLowerCase()?.includes(s) ||
        item.description?.toLowerCase()?.includes(s) ||
        item.amount?.toString()?.includes(s)
      );
    }
    return true;
  });

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header title="Pesquisar" leftIcon={<BackButton />} />

        {/* ÁREA DO INPUT */}
        <View style={styles.searchBarContainer}>
          <Input
            inputRef={inputRef}
            placeholder="O que procuras? (Ex: Almoço, Salário...)"
            value={search}
            onChangeText={setSearch}
            icon={<MagnifyingGlass size={20} weight="bold" />}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearch("")}
            >
              <XCircle size={22} weight="fill" color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* INDICADOR DE RESULTADOS */}
          {search.length > 1 && (
            <View style={styles.resultsInfo}>
              <Typo size={14} color="#666">
                Encontramos{" "}
                <Typo size={14} fontWeight="700" color={Colors.primary}>
                  {filteredTransaction.length}
                </Typo>{" "}
                resultados
              </Typo>
            </View>
          )}

          <TransitionList
            loading={transactionLoading}
            data={filteredTransaction}
            emptyListMessage="Não encontramos nada com esse nome."
          />
        </ScrollView>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  searchBarContainer: {
    marginTop: verticalScale(10),
    position: "relative", // Para o botão de limpar
  },
  clearButton: {
    position: "absolute",
    right: scale(15),
    top: verticalScale(17),
    zIndex: 10,
  },
  scrollContent: {
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(30),
  },
  resultsInfo: {
    marginBottom: verticalScale(15),
    paddingLeft: scale(5),
  },
});
