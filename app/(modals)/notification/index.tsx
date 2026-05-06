import CustomAlert from "@/components/CustomAlert";
import ModalWrapper from "@/components/ModalWrapper";
import { useAuth } from "@/contexts/AuthProvider";
import * as schema from "@/db/schema";
import {
  deleteNotification,
  syncNotification,
} from "@/services/notificationService";
import { NotificationType } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import NotificationsModalView from "./_notificationModalView";

export default function NotificationsModal() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as any,
  });

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" = "error",
  ) => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const getInitialTime = () => {
    const date = new Date();
    date.setHours(13, 0, 0, 0); // Define 13:00:00
    return date;
  };

  const [notification, setNotification] = useState<NotificationType>({
    title: "",
    frequency: 1,
    schedule_date: new Date(),
    schedule_time: getInitialTime(),
    body: "",
    user: user?.uid,
  });

  const params: {
    user: string;
    id: string;
    title: string;
    body: string;
    frequency: string;
    schedule_date: string;
    schedule_time: string;
    enabled: any;
    marked_to_delete: string;
  } = useLocalSearchParams();

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

  const handleSubmit = async () => {
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
      showAlert(
        "Data Inválida",
        "Não podes agendar um lembrete para um horário que já passou.",
      );
      return;
    }

    if (!title.trim()) {
      showAlert(
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

      await syncNotification(notificationData);
      router.back();
    } catch (error) {
      showAlert("Erro", "Não foi possível guardar a notificação.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!params.id) return;
    setLoading(true);
    try {
      await deleteNotification(params.id, user?.uid as string);
      router.back();
    } catch (error) {
      showAlert("Erro", "Não foi possível eliminar a notificação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper>
      <NotificationsModalView
        params={params}
        notification={notification}
        loading={loading}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        formatDate={formatDate}
        formatTime={formatTime}
        setNotification={setNotification}
      />
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </ModalWrapper>
  );
}
