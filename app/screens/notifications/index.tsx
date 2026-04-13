import { NotificationRepo } from "@/db/repository";
import { NotificationRecord } from "@/db/schema";
import { syncNotification } from "@/services/notificationService";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import NotificationsView from "./_notificationsView";

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const loadNotifications = async () => {
    const list = await NotificationRepo.getAll();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
  }, [refreshKey]);

  const handleSwitchChange = async (
    notification: NotificationRecord,
    value: boolean,
  ) => {
    const updated = { ...notification, enabled: value };
    await syncNotification(updated);
    setNotifications((prev) =>
      prev.map((i) => (i.id === notification.id ? updated : i)),
    );
  };

  return (
    <NotificationsView
      notifications={notifications}
      onSwitchChange={handleSwitchChange}
    />
  );
}
