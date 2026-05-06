import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { frequencyNotification as frequency } from "@/constants/data_notification";
import { useTheme } from "@/contexts/ThemeContext";
import { NotificationType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type NotificationsModalViewProps = {
  params: {
    id?: string | undefined;
    title?: string | undefined;
    body?: string | undefined;
    frequency?: string | undefined;
    schedule_date?: string | undefined;
    schedule_time?: string | undefined;
  };
  notification: NotificationType;
  loading: boolean;
  onSubmit: () => void;
  onDelete: () => void;
  formatDate: (value: string | Date) => string;
  formatTime: (value: string | Date) => string;
  setNotification: (value: NotificationType) => void;
};

export default function NotificationsModalView({
  params,
  notification,
  loading,
  onSubmit,
  onDelete,
  formatDate,
  formatTime,
  setNotification,
}: NotificationsModalViewProps) {
  const { theme } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <>
      <View style={{ paddingHorizontal: scale(20), flex: 1 }}>
        <Header
          title={params.id ? "Editar Lembrete" : "Novo Lembrete"}
          leftIcon={<BackButton />}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* TÍTULO */}
            <View style={styles.inputGap}>
              <Typo size={16}>Título</Typo>
              <Input
                placeholder="Ex: Pagar a renda"
                value={notification.title}
                onChangeText={(v) =>
                  setNotification({ ...notification, title: v })
                }
              />
            </View>

            {/* FREQUÊNCIA */}
            <View style={styles.inputGap}>
              <Typo size={16}>Repetir</Typo>
              <Dropdown
                style={[
                  styles.dropdownContainer,
                  { backgroundColor: theme.navBackground },
                ]}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={[
                  styles.dropdownSelectedText,
                  { color: theme.title },
                ]}
                data={frequency}
                labelField={"label"}
                valueField={"value"}
                value={notification.frequency}
                onChange={(item) =>
                  setNotification({ ...notification, frequency: item.value })
                }
                containerStyle={[
                  styles.dropdownListContainer,
                  { backgroundColor: theme.background },
                ]}
                itemTextStyle={{ color: theme.title }}
                activeColor={Colors.dark.primary + "40"}
              />
            </View>

            {/* DATA E HORA EM ROW */}
            <View style={{ flexDirection: "row", gap: scale(15) }}>
              <View style={[styles.inputGap, { flex: 1 }]}>
                <Typo size={16}>Data</Typo>
                <Pressable
                  style={[
                    styles.dateInput,
                    { backgroundColor: theme.navBackground },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <FontAwesome6
                    name="calendar-days"
                    size={16}
                    color={Colors.dark.primary}
                  />
                  <Typo size={14}>
                    {formatDate(notification.schedule_date)}
                  </Typo>
                </Pressable>
              </View>

              <View style={[styles.inputGap, { flex: 0.8 }]}>
                <Typo size={16}>Hora</Typo>
                <Pressable
                  style={[
                    styles.dateInput,
                    { backgroundColor: theme.navBackground },
                  ]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <FontAwesome6
                    name="clock"
                    size={16}
                    color={Colors.dark.primary}
                  />
                  <Typo size={14}>
                    {formatTime(notification.schedule_time as Date)}
                  </Typo>
                </Pressable>
              </View>
            </View>

            {/* DESCRIÇÃO */}
            <View style={styles.inputGap}>
              <Typo size={16}>Notas (Opcional)</Typo>
              <Input
                multiline
                placeholder="Detalhes adicionais..."
                value={notification.body}
                containerStyle={styles.textArea}
                onChangeText={(v) =>
                  setNotification({ ...notification, body: v })
                }
              />
            </View>

            {/* PICKERS CONDICIONAIS */}
            {showDatePicker && (
              <DateTimePicker
                value={notification.schedule_date as Date}
                mode="date"
                minimumDate={new Date()}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, date) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (date)
                    setNotification({ ...notification, schedule_date: date });
                }}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={notification.schedule_time as Date}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, date) => {
                  setShowTimePicker(Platform.OS === "ios");
                  if (date)
                    setNotification({ ...notification, schedule_time: date });
                }}
              />
            )}
            <View style={styles.footer}>
              {params.id && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() =>
                    Alert.alert("Eliminar", "Desejas apagar este lembrete?", [
                      { text: "Não" },
                      { text: "Sim", onPress: onDelete, style: "destructive" },
                    ])
                  }
                >
                  <FontAwesome6 name="trash-can" size={20} color="#fff" />
                </TouchableOpacity>
              )}
              <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                <Typo color="#000" fontWeight={"700"}>
                  {params.id ? "Salvar Alterações" : "Criar Lembrete"}
                </Typo>
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: verticalScale(20),
    paddingBottom: verticalScale(40),
    paddingVertical: verticalScale(15),
  },
  inputGap: {
    gap: verticalScale(8),
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: scale(15),
    gap: 10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderRadius: 15,
    paddingHorizontal: scale(15),
  },
  dropdownListContainer: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  dropdownSelectedText: { color: "#fff", fontSize: 14 },
  dropdownPlaceholder: { color: "#666", fontSize: 14 },
  textArea: {
    height: verticalScale(100),
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  footer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(20),
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deleteBtn: {
    backgroundColor: "#dc2626",
    width: scale(54),
    height: verticalScale(54),
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
