import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { NotificationRecord } from "@/db/schema";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

type NotificationsViewProps = {
  onSwitchChange: (item: NotificationRecord, value: boolean) => void;
  notifications: NotificationRecord[];
};

export default function NotificationsView({
  notifications,
  onSwitchChange,
}: NotificationsViewProps) {
  const { theme } = useTheme();
  const renderNotification = ({ item }: { item: NotificationRecord }) => (
    <View style={[styles.notificationCard, { backgroundColor: theme.border }]}>
      <View style={styles.cardInfo}>
        <Typo size={18} fontWeight="600">
          {item.title}
        </Typo>
        <Typo size={14} color="#aaa" style={{ marginTop: 2 }}>
          {item.body}
        </Typo>
      </View>
      <Switch
        value={item.enabled}
        onValueChange={(value) => onSwitchChange(item, value)}
        trackColor={{ false: "#333", true: `${Colors.dark.primary}80` }}
        thumbColor={item.enabled ? Colors.dark.primary : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title="Lembretes"
          leftIcon={<BackButton />}
          style={{ marginBottom: verticalScale(20) }}
        />

        {/* Secção de Ação */}
        <View style={styles.actionHeader}>
          <Typo size={20} fontWeight="700">
            Meus Agendamentos
          </Typo>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(modals)/notification")}
            style={styles.createButton}
          >
            <FontAwesome6 name="plus" color={"#fff"} size={scale(14)} />
            <Typo size={16} fontWeight="600" color="#fff">
              Criar
            </Typo>
          </TouchableOpacity>
        </View>

        {/* Lista de Notificações */}
        <FlatList
          data={notifications}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FontAwesome6 name="bell-slash" size={scale(40)} color="#333" />
              <Typo color="#555" style={{ marginTop: 10 }}>
                Nenhum lembrete configurado.
              </Typo>
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  actionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(25),
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.primary,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(15),
    borderRadius: 12,
    gap: 8,
  },
  listContent: {
    paddingBottom: verticalScale(30),
    gap: verticalScale(15),
  },
  notificationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: scale(16),
    borderRadius: 20,
  },
  cardInfo: {
    flex: 1,
    paddingRight: scale(10),
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(100),
  },
});
