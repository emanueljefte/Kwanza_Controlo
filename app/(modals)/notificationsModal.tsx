import BackButton from "@/components/BackButton";
import Button from "@/components/ButtonLayout";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { frequencyNotification as frequency } from "@/constants/data_notification";
import { useAuth } from "@/contexts/AuthProvider";
import * as schema from "@/db/schema";
import {
  deleteNotification,
  syncNotification,
} from "@/services/notificationService"; // Certifica-te de ter o deleteNotification
import { NotificationType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function NotificationsModal() {
  const { user } = useAuth();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    body?: string;
    frequency?: string;
    schedule_date?: string;
    schedule_time?: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const getInitialTime = () => {
    const date = new Date();
    date.setHours(13, 0, 0, 0); // Define 13:00:00
    return date;
  };

  const [notification, setNotification] = useState<NotificationType>({
    title: "",
    frequency: 1,
    schedule_date: new Date(),
    schedule_time: getInitialTime(), // Usa a função acima
    body: "",
    user: user?.uid,
  });

  useEffect(() => {
    if (params.id) {
      setNotification({
        id: params.id,
        title: params.title || "",
        frequency: Number(params.frequency) || 1,
        schedule_date: params.schedule_date
          ? new Date(params.schedule_date)
          : new Date(),
        schedule_time: params.schedule_time
          ? new Date(params.schedule_time)
          : new Date(),
        body: params.body || "",
        user: user?.uid,
      });
    }
  }, [params.id]);

  const ensureDate = (value: string | Date): Date => {
    return typeof value === "string" ? new Date(value) : value;
  };

  // Formata apenas a Data (Ex: 26/02/2026)
  const formatDate = (dateValue: string | Date) => {
    const date = ensureDate(dateValue);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
  };

  const formatTime = (time: Date | string) => {
    const date = typeof time === "string" ? new Date(time) : time;

    // Verifica se a conversão resultou numa data válida
    if (isNaN(date.getTime())) return "00:00";

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const onSubmit = async () => {
    let { title, frequency, body, schedule_time, schedule_date } = notification;

    // Garantir que temos objetos Date para manipular
    const sDate =
      typeof schedule_date === "string"
        ? new Date(schedule_date)
        : schedule_date;
    const sTime =
      typeof schedule_time === "string"
        ? new Date(schedule_time)
        : schedule_time;

    // Criar data combinada para validação
    const combinedDate = new Date(sDate);
    combinedDate.setHours(sTime.getHours(), sTime.getMinutes(), 0, 0);

    if (combinedDate < new Date()) {
      Alert.alert(
        "Data Inválida",
        "Não podes agendar um lembrete para um horário que já passou.",
      );
      return;
    }

    if (!title.trim()) {
      Alert.alert(
        "Campo Obrigatório",
        "Por favor, insira um título para o lembrete.",
      );
      return;
    }

    setLoading(true);
    try {
      const notificationData: schema.NotificationRecord = {
        id: params.id || Date.now().toString(),
        title: title,
        body: body || "",
        frequency: frequency,
        schedule_date: sDate.toISOString(),
        schedule_time: sTime.toISOString(),
        enabled: true,
        user: user?.uid || "guest",
        marked_to_delete: false,
      };

      await syncNotification(drizzleDb, notificationData);
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível guardar a notificação.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!params.id) return;
    setLoading(true);
    try {
      // Assume-se que criaste uma função deleteNotification no teu service
      await deleteNotification(drizzleDb, params.id, user?.uid as string);
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível eliminar a notificação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper>
      <View style={{ paddingHorizontal: scale(20), flex: 1 }}>
        <Header
          title={params.id ? "Editar Lembrete" : "Novo Lembrete"}
          leftIcon={<BackButton />}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* TÍTULO */}
          <View style={styles.inputGap}>
            <Typo color={"#bbb"} size={16}>
              Título
            </Typo>
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
            <Typo color={"#bbb"} size={16}>
              Repetir
            </Typo>
            <Dropdown
              style={styles.dropdownContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              data={frequency}
              labelField={"label"}
              valueField={"value"}
              value={notification.frequency}
              onChange={(item) =>
                setNotification({ ...notification, frequency: item.value })
              }
              containerStyle={styles.dropdownListContainer}
              itemTextStyle={{ color: "#fff" }}
              activeColor={Colors.primary + "40"}
            />
          </View>

          {/* DATA E HORA EM ROW */}
          <View style={{ flexDirection: "row", gap: scale(15) }}>
            <View style={[styles.inputGap, { flex: 1 }]}>
              <Typo color={"#bbb"} size={16}>
                Data
              </Typo>
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <FontAwesome6
                  name="calendar-days"
                  size={16}
                  color={Colors.primary}
                />
                <Typo size={14}>{formatDate(notification.schedule_date)}</Typo>
              </Pressable>
            </View>

            <View style={[styles.inputGap, { flex: 0.8 }]}>
              <Typo color={"#bbb"} size={16}>
                Hora
              </Typo>
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowTimePicker(true)}
              >
                <FontAwesome6 name="clock" size={16} color={Colors.primary} />
                <Typo size={14}>
                  {formatTime(notification.schedule_time as Date)}
                </Typo>
              </Pressable>
            </View>
          </View>

          {/* DESCRIÇÃO */}
          <View style={styles.inputGap}>
            <Typo color={"#bbb"} size={16}>
              Notas (Opcional)
            </Typo>
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
        </ScrollView>
      </View>

      {/* FOOTER ACTIONS */}
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
    </ModalWrapper>
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
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderRadius: 15,
    paddingHorizontal: scale(15),
    gap: 10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingHorizontal: scale(15),
  },
  dropdownListContainer: {
    backgroundColor: "#1A1A1A",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
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
    borderTopWidth: 1,
    borderTopColor: "#222",
    gap: scale(12),
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
