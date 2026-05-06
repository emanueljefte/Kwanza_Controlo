import * as schema from "@/db/schema";
import { NotificationType } from "@/types";
import notifee, {
  AndroidImportance,
  EventType,
  RepeatFrequency,
  TimestampTrigger,
  TriggerNotification,
  TriggerType,
} from "@notifee/react-native";

import { db } from "@/db";
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

export async function syncNotification(data: NotificationRecord) {
  // 1. Atualiza o banco de dados primeiro
  await NotificationRepo.save(data);

  // 2. Se desativado, remove do sistema e encerra
  if (!data.enabled) {
    await notifee.cancelNotification(data.id);
    return;
  }

  // 3. Preparar datas de forma segura
  const now = new Date();
  const startDate = new Date(data.schedule_date);
  const timeDate = new Date(data.schedule_time);

  // Criamos o triggerDate garantindo o fuso horário local
  let triggerDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    timeDate.getHours(),
    timeDate.getMinutes(),
    0,
  );

  if (data.frequency === 1 && triggerDate.getTime() <= now.getTime()) {
    console.log("Notificação única já expirou. Desativando...");

    // Atualiza no banco para disabled
    await NotificationRepo.save({ ...data, enabled: false });

    // Cancela qualquer agendamento pendente no Notifee por segurança
    await notifee.cancelNotification(data.id);
    return;
  }

  if (triggerDate.getTime() <= now.getTime()) {
    if (data.frequency === 2) {
      // Diário
      triggerDate.setDate(triggerDate.getDate() + 1);
    } else if (data.frequency === 3) {
      // Semanal
      triggerDate.setDate(triggerDate.getDate() + 7);
    } else {
      // Se não for recorrente e já passou, não agendamos
      console.warn("Data no passado para notificação única.");
      return;
    }
  }

  // 4. Mapear Frequência
  let repeatFrequency: RepeatFrequency | undefined;
  if (data.frequency === 2) repeatFrequency = RepeatFrequency.DAILY;
  if (data.frequency === 3) repeatFrequency = RepeatFrequency.WEEKLY;

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerDate.getTime(), // O getTime() já retorna o UTC milisegundos correto para o fuso local
    repeatFrequency,
    alarmManager: {
      allowWhileIdle: true, // Importante para Android não matar a notificação em Doze Mode
    },
  };

  // 5. Configuração do Canal e Agendamento
  const channelId = await notifee.createChannel({
    id: "reminders",
    name: "Lembretes Financeiros",
    importance: AndroidImportance.HIGH,
    sound: "default",
  });

  // Cancelamos qualquer agendamento anterior do mesmo ID antes de criar o novo (Prevenção de duplicados)
  await notifee.cancelNotification(data.id);

  await notifee.createTriggerNotification(
    {
      id: data.id,
      title: data.title,
      body: data.body,
      android: {
        channelId,
        pressAction: { id: "default" },
        // Sugestão: adicione um ícone pequeno aqui se tiver
      },
    },
    trigger,
  );

  console.log(
    `Notificação [${data.title}] agendada para: ${triggerDate.toString()}`,
  );
}

export const deleteNotification = async (id: string, uid: string) => {
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

export const formatScheduleDisplay = (item: any) => {
  const date = new Date(item.schedule_time);

  // Opções para apenas hora: 14:30
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  // Opções para data e hora: 30 Abr, 14:30
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (item.frequency === 1) {
    return date.toLocaleString("pt-AO", dateTimeOptions);
  }

  return date.toLocaleString("pt-AO", timeOptions);
};

export const ForegroundNotification = () => {
  // Subscrever aos eventos em primeiro plano (Foreground)
  const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
    const { notification } = detail;

    // Evento de clique na notificação
    if (type === EventType.PRESS && notification?.id) {
      // 1. Procurar a notificação no banco de dados local
      const [notificationData] = await NotificationRepo.findById(
        notification.id,
      );

      if (notificationData) {
        // 2. Verificar se é uma notificação de execução única (frequency === 1)
        if (notificationData.frequency === 1) {
          console.log(
            `Notificação única [${notification.id}] executada. Desativando...`,
          );

          // 3. Atualizar para desativado para que o Switch na UI reflita o estado real
          await NotificationRepo.save({
            ...notificationData,
            enabled: false,
          });
        }
      }

      // 4. Remover a notificação da barra de estado após o clique (opcional)
      if (notification.id) {
        await notifee.cancelNotification(notification.id);
      }
    }
  });

  return () => unsubscribe(); // Limpar a subscrição ao desmontar
};
