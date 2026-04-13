import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import TransitionList from "@/components/TransitionList";
import Typo from "@/components/Typo"; // Certifique-se de importar o Typo
import { Colors } from "@/constants/colors";
import { TransactionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { MagnifyingGlassIcon, XCircleIcon } from "phosphor-react-native";
import React, { RefObject } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SearchModalView = {
  input: RefObject<TextInput>;
  search: string;
  loading: boolean;
  transaction: TransactionType[];
  setSearch: (value: string) => void;
};
export default function SearchModalView({
  input,
  search,
  loading,
  transaction,
  setSearch,
}: SearchModalView) {
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header title="Pesquisar" leftIcon={<BackButton />} />

        {/* ÁREA DO INPUT */}
        <View style={styles.searchBarContainer}>
          <Input
            inputRef={input}
            placeholder="O que procuras? (Ex: Almoço, Salário...)"
            value={search}
            onChangeText={setSearch}
            icon={<MagnifyingGlassIcon size={20} weight="bold" />}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearch("")}
            >
              <XCircleIcon size={22} weight="fill" color="#999" />
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
              <Typo size={14} color="#888">
                Encontramos{" "}
                <Typo size={14} fontWeight="700" color={Colors.dark.primary}>
                  {transaction.length}
                </Typo>{" "}
                resultados
              </Typo>
            </View>
          )}

          <TransitionList
            loading={loading}
            data={transaction}
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
