import * as schema from "@/db/schema";
import { NotificationType } from "@/types";
import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TimestampTrigger,
  TriggerNotification,
  TriggerType,
} from "@notifee/react-native";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

import { and, eq } from "drizzle-orm";
import { NotificationRepo } from "../db/repository";
import { NotificationRecord } from "../db/schema";

async function createChannelId() {
  const channelId = await notifee.createChannel({
    id: "test",
    name: "local",
    vibration: true,
    importance: AndroidImportance.HIGH,
  });
  return channelId;
}

export async function displayNotification(notification: NotificationType) {
  await notifee.requestPermission();

  const channelId = await createChannelId();

  await notifee.displayNotification({
    title: "Cheguei, Cambada",
    body: "Seja Bem-vindo",
    android: { channelId },
  });

  console.log(notification);
}

async function updateNotification() {
  await notifee.requestPermission();
  const channelId = await createChannelId();

  await notifee.displayNotification({
    id: "7",
    title: "Cheguei, Cambada",
    body: "Seja Bem-vindo",
    android: { channelId },
  });
}

export async function cancelNotification(id: string) {
  await notifee.cancelNotification(id);
}

export async function scheduleNotification(data: NotificationRecord) {
  // 1. Combinar a Data e a Hora em um único objeto Date
  const startDate = new Date(data.schedule_date);
  const timeDate = new Date(data.schedule_time);

  const triggerDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    timeDate.getHours(),
    timeDate.getMinutes(),
    0,
  );

  // 2. Mapear o valor numérico para o RepeatFrequency do Notifee
  let repeatFrequency: RepeatFrequency | undefined;

  switch (data.frequency) {
    case 2: // Diariamente
      repeatFrequency = RepeatFrequency.DAILY;
      break;
    case 3: // Semanalmente
      repeatFrequency = RepeatFrequency.WEEKLY;
      break;
    case 1: // Uma vez
    default:
      repeatFrequency = undefined; // Sem repetição
      break;
  }

  // 3. Configurar o Trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerDate.getTime(),
    repeatFrequency: repeatFrequency,
    alarmManager: true, // Garante precisão mesmo com o celular em modo econômico
  };

  // 4. Criar o canal (Android)
  const channelId = await notifee.createChannel({
    id: "reminders",
    name: "Lembretes de Pagamento",
    importance: AndroidImportance.HIGH,
  });

  // 5. Agendar
  await notifee.createTriggerNotification(
    {
      title: data.title,
      body: data.body,
      android: {
        channelId,
        pressAction: {
          id: "default",
        },
      },
    },
    trigger,
  );

  console.log(`Notificação agendada para: ${triggerDate.toString()}`);
}

export async function listScheduleNotifications(): Promise<
  TriggerNotification[]
> {
  return await notifee.getTriggerNotifications();
}

export async function syncNotification(
  drizzleDb: ExpoSQLiteDatabase<typeof schema>,
  data: NotificationRecord,
) {
  // 1. Sempre atualiza o banco de dados primeiro
  await NotificationRepo.save(drizzleDb, data);

  // 2. Se estiver desativado, removemos do sistema de triggers do Android/iOS
  if (!data.enabled) {
    await notifee.cancelNotification(data.id);
    return;
  }

  // 3. Preparar datas (Combina Data com Hora)
  const startDate = new Date(data.schedule_date);
  const timeDate = new Date(data.schedule_time);

  const triggerDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    timeDate.getHours(),
    timeDate.getMinutes(),
    0,
  );

  // Se a data/hora já passou e não é recorrente, não agenda
  if (triggerDate.getTime() <= Date.now() && data.frequency === 1) {
    console.warn("Tentativa de agendar notificação no passado.");
    return;
  }

  // 4. Mapear Frequência
  let repeatFrequency: RepeatFrequency | undefined;
  if (data.frequency === 2) repeatFrequency = RepeatFrequency.DAILY;
  if (data.frequency === 3) repeatFrequency = RepeatFrequency.WEEKLY;

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerDate.getTime(),
    repeatFrequency,
    alarmManager: true,
  };

  // 5. Agendar no Notifee
  const channelId = await notifee.createChannel({
    id: "reminders",
    name: "Lembretes Financeiros",
    importance: AndroidImportance.HIGH,
  });

  await notifee.createTriggerNotification(
    {
      id: data.id,
      title: data.title,
      body: data.body,
      android: {
        channelId,
        pressAction: {
          id: "default",
        },
      },
    },
    trigger,
  );
}

export const deleteNotification = async (
  db: ExpoSQLiteDatabase<typeof schema>,
  id: string,
  uid: string,
) => {
  try {
    // 1. Cancelar o agendamento no Notifee primeiro
    // Usamos o ID da notificação como o ID do agendamento para manter a paridade
    await notifee.cancelNotification(id);

    // 2. Remover do SQLite usando o Drizzle
    await db
      .delete(schema.notifications)
      .where(
        and(
          eq(schema.notifications.id, id),
          eq(schema.notifications.user, uid),
        ),
      );

    console.log(
      `[NotificationService] Notificação ${id} removida com sucesso.`,
    );

    return { success: true };
  } catch (error) {
    console.error("[NotificationService] Erro ao eliminar notificação:", error);
    throw error; // Lançamos o erro para ser capturado pelo Alert no modal
  }
};
