import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { NotificationRecord } from "@/db/schema";
import { formatScheduleDisplay } from "@/services/notificationService";
import { scale, verticalScale } from "@/utils/styling";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  BellSimpleIcon,
  BellSlashIcon,
  ClockIcon,
} from "phosphor-react-native";
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
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.notificationCard, { backgroundColor: theme.border }]}
      onPress={() =>
        router.push({ pathname: "/(modals)/notification", params: item as any })
      }
    >
      <View style={styles.cardContent}>
        {/* Ícone Lateral de Status */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: item.enabled
                ? `${Colors.dark.primary}20`
                : "#333",
            },
          ]}
        >
          {item.enabled ? (
            <BellSimpleIcon
              size={24}
              color={Colors.dark.primary}
              weight="fill"
            />
          ) : (
            <BellSlashIcon size={24} color="#666" weight="regular" />
          )}
        </View>

        <View style={styles.cardInfo}>
          <Typo
            size={17}
            fontWeight="700"
            color={item.enabled ? "#fff" : "#888"}
          >
            {item.title}
          </Typo>

          <Typo size={13} color="#aaa" style={{ marginBottom: 8 }}>
            {item.body}
          </Typo>

          {/* Linha de Detalhes com Ícones */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <ClockIcon size={14} color={Colors.dark.primary} weight="bold" />
              <Typo size={13} fontWeight="600" style={{ marginLeft: 4 }}>
                {formatScheduleDisplay(item)}
              </Typo>
            </View>
          </View>
        </View>

        {/* Controle do Switch */}
        <View style={styles.switchWrapper}>
          <Switch
            value={item.enabled}
            onValueChange={(value) => onSwitchChange(item, value)}
            trackColor={{ false: "#444", true: `${Colors.dark.primary}80` }}
            thumbColor={item.enabled ? Colors.dark.primary : "#999"}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>
    </TouchableOpacity>
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(100),
  },
  notificationCard: {
    borderRadius: 20,
    padding: scale(16),
    marginBottom: scale(12),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  switchWrapper: {
    marginLeft: scale(10),
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }], // Switch ligeiramente menor para elegância
  },
});
