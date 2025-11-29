import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/AuthProvider";
import useFetchData from "@/hooks/useFetchData";
import { deleteWallet } from "@/services/walletService";
import { TransactionType, WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

import { expenseCategories } from "@/constants/data";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function transactionnsactionModel() {
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, [])
  );

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>(
    "wallets",
    { uid: user?.uid as string, orderBy: "created", sort: "desc" },
    refreshKey
  );

  const oldTransaction: { name: string; image: string; id: string } =
    useLocalSearchParams();

  const onDateChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };
  //   useEffect(() => {

  //     if (oldTransaction?.id) {
  //       setTransaction({
  //         name: oldTransaction?.name,
  //         image: oldTransaction?.image
  //       })

  //     }
  //   }, [])
  const onSubmit = async () => {
    let { type, amount, description, category, date, walletId, image } = transaction;

    if (!walletId || !date || !amount || (type == 'expense' && !category)) {
      Alert.alert("Transação", "Por favor Preencha todos os campos");
      return
    }

    const transactionData: TransactionType = {
      type, amount, description, category, date, walletId, image, uid: user?.uid
    }

    // if (oldTransaction?.id) data.id = oldTransaction.id
    // setLoading(true)
    // const res = await createOrUpdatetransaction(data)
    // setLoading(false)
    // if (res.success) {
    //   router.back()
    // } else {
    //   Alert.alert("transaction", res.msg)
    // }
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldTransaction?.id);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("transaction", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirmação",
      "Tens ceteza que pretendes realizar isto? \nEsta ação removerá todas as transações relacionadas com este cartão",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Deletar cancelado"),
          style: "cancel",
        },
        {
          text: "Deletar",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={{ paddingHorizontal: verticalScale(20) }} className="flex-1">
        <Header
          title={oldTransaction?.id ? "Atualizar Transação" : "Nova Transação"}
          leftIcon={<BackButton />}
          style={{ marginBottom: verticalScale(10) }}
        />

        <ScrollView
          contentContainerStyle={{
            gap: verticalScale(20),
            paddingBottom: verticalScale(40),
            paddingVertical: verticalScale(15),
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* TRANSACTION TYPE */}
          {/* <View style={{ gap: verticalScale(10) }}>
            <Typo color={"#bbb"} size={16}>Tipo</Typo>
            <Dropdown style={styles.dropdownContainer} placeholderStyle={styles.dropdownPlaceholder} selectedTextStyle={styles.dropdownSelectedText} iconStyle={styles.dropdownIcon} data={TransactionType} maxHeight={300} labelField={'label'} valueField={'value'} value={transaction.type} onChange={(item) => setTransaction({...transaction, type: item.value})} itemTextStyle={styles.dropdownItemText} itemContainerStyle={styles.dropdownItemContainer} containerStyle={styles.dropdownListContainer} activeColor={'#ccc'} placeholder={!isFocus ? "Selecione o item"} />
          </View> */}

          {/* WALLET */}
          {/* // <View style={{ gap: verticalScale(10) }}>
          //   <Typo color={"#bbb"} size={16}>Carteira</Typo>
          //   <Dropdown style={styles.dropdownContainer} placeholderStyle={styles.dropdownPlaceholder} selectedTextStyle={styles.dropdownSelectedText} iconStyle={styles.dropdownIcon} data={wallets.map(wallet => {{label: `${wallet?.name {${wallet.amount}}}`, value: wallet?.id}})} maxHeight={300} labelField={'label'} valueField={'value'} value={transaction.type} onChange={(item) => setTransaction({...transaction, walletId: item.value || ''})} itemTextStyle={styles.dropdownItemText} itemContainerStyle={styles.dropdownItemContainer} containerStyle={styles.dropdownListContainer} activeColor={'#ccc'} placeholder={"Selecione a carteira"} />
          // </View> */}

          {/* CATEGORY */}
           {
                transaction.type === 'expense' && (
                    <View style={{ gap: verticalScale(10) }}>
                      <Typo color={"#bbb"} size={16}>Categoria de Despesa</Typo>
                      <Dropdown style={styles.dropdownContainer} placeholderStyle={styles.dropdownPlaceholder} selectedTextStyle={styles.dropdownSelectedText} iconStyle={styles.dropdownIcon} data={Object.values(expenseCategories)} maxHeight={300} labelField={'label'} valueField={'value'} value={transaction.category} onChange={(item) => setTransaction({...transaction, category: item.value})} itemTextStyle={styles.dropdownItemText} itemContainerStyle={styles.dropdownItemContainer} containerStyle={styles.dropdownListContainer} activeColor={'#ccc'} placeholder={!isFocus ? "Selecione o item": ""} />
                    </View>

                )
            } 

          <View style={{ gap: verticalScale(10) }}>
            <Typo color={"#bbb"} size={16}>Data</Typo>
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}

            {showDatePicker && (
              <View style={Platform.OS == "ios" && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={"#fff"}
                  mode="date"
                  display={Platform.OS == "ios" ? "spinner" : "default"}
                  onChange={onDateChange as any}
                />

                {Platform.OS == "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={"500"}>
                      Ok
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* AMOUNT */}
          <View style={{ gap: verticalScale(10) }}>
            <Typo color={"#bbb"} size={16}>Montante</Typo>
            <Input
              // placeholder="Salário"
              keyboardType="numeric"
              value={transaction?.amount.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>

          <View style={{ gap: verticalScale(10) }}>
            <View style={styles.flexRow}>
            <Typo color={"#bbb"} size={16}>Descrição</Typo>
            <Typo color={"#666"} size={14}>(Oopcional)</Typo>

            </View>
            <Input
              // placeholder="Salário"
              keyboardType="numeric"
              value={transaction?.description}
              containerStyle={{flexDirection: 'row', height: verticalScale(100), alignItems: 'flex-start', paddingVertical: 15}}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>

          <View style={{ gap: verticalScale(10) }}>
             <View style={styles.flexRow}>
            <Typo color={"#bbb"} size={16}>Imagem</Typo>
            <Typo color={"#666"} size={14}>(Oopcional)</Typo>

            </View>
            <ImageUpload
              file={transaction.image}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              onClear={() => setTransaction({ ...transaction, image: null })}
              placeholder="Carregar Imagem"
            />
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          paddingHorizontal: scale(20),
          paddingTop: verticalScale(15),
          marginBottom: verticalScale(5),
          gap: scale(12),
        }}
        className="items-center flex-row justify-center border-t-neutral-700 border-t"
      >
        {oldTransaction?.id && !loading && (
          <Button
            style={{ paddingHorizontal: scale(15), backgroundColor: "#dc2626" }}
            onPress={showDeleteAlert}
          >
            <FontAwesome
              name="trash"
              color={"#fff"}
              size={verticalScale(24)}
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color="#000" fontWeight={"700"}>
            {oldTransaction?.id ? "Actualizar" : "Adicionar"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  datePickerButton: {
    backgroundColor: "#444",
    alignSelf: "flex-end",
    padding: verticalScale(7),
    marginRight: scale(7),
    paddingHorizontal: verticalScale(15),
    borderRadius: verticalScale(10),
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderRadius: 1,
    borderColor: "#999",
    paddingHorizontal: scale(15),
    borderCurve: "continuous",
  },
  dropdownItemText: {
    color: "#fff",
  },
  dropdownSelectedText: {
    color: "#fff",
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: "#111",
    borderRadius: verticalScale(15),
    borderCurve: "continuous",
    paddingVertical: verticalScale(7),
    top: 5,
    borderColor: "#aaa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: "#fff",
  },
  dropdownItemContainer: {
    borderRadius: verticalScale(15),
    marginHorizontal: scale(7),
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: "#333",
  },
  dateInput: {
    flexDirection: 'row',
    height: verticalScale(54),
    alignItems: "center",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: verticalScale(17),
    borderCurve: "continuous",
    paddingHorizontal: scale(15),
  },
  iosDatePicker: {},
  flexRow: {
    flexDirection: "row",
    alignSelf: "center",
    gap: scale(5),
  },
});
