import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { scale, verticalScale } from "@/utils/styling";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Icons from "phosphor-react-native";
import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
const { height } = Dimensions.get("window");

export default function CustomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme } = useTheme();
  const activeColors = Colors[theme];

  // Configuração dos ícones com variantes Fill/Outline
  const renderIcon = (routeName: string, isFocused: boolean) => {
    const iconConfig: Icons.IconProps = {
      size: verticalScale(26),
      color: isFocused ? Colors.primary : activeColors.text,
      weight: isFocused ? "fill" : ("regular" as const),
    };

    switch (routeName) {
      case "index":
        return <Icons.HouseIcon {...iconConfig} />;
      case "statistics":
        return <Icons.ChartBarIcon {...iconConfig} />;
      case "wallet":
        return <Icons.WalletIcon {...iconConfig} />;
      case "profile":
        return <Icons.UserIcon {...iconConfig} />;
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.tabContainer,
        {
          marginBottom: Platform.OS == "ios" ? height * 0.06 : 30,
          backgroundColor: activeColors.background,
          borderTopColor: theme === "dark" ? "#333" : "#eee",
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.name}
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.tabButton}
          >
            {/* O Ícone */}
            <View
              style={[
                styles.iconWrapper,
                isFocused && {
                  backgroundColor: theme === "dark" ? "#222" : "#FFF3E0",
                },
              ]}
            >
              {renderIcon(route.name, isFocused)}
            </View>

            {/* Indicador de Dot (Bolinha) */}
            {isFocused && (
              <View
                style={[styles.activeDot, { backgroundColor: Colors.primary }]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? verticalScale(85) : verticalScale(75),
    paddingBottom:
      Platform.OS === "ios" ? verticalScale(20) : verticalScale(30),
    justifyContent: "space-around",
    alignItems: "center",
    // Sombra leve
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconWrapper: {
    padding: scale(8),
    borderRadius: scale(14),
    marginBottom: verticalScale(4),
  },
  activeDot: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    position: "absolute",
    bottom: verticalScale(-2),
  },
});
