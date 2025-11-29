import { verticalScale } from "@/utils/styling";
import { FontAwesome } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabBarIcons: any = {
    index: (isFocuse: boolean) => (
      <FontAwesome
        name="home"
        size={verticalScale(30)}
        color={isFocuse ? "#f97316" : "#999"}
      />
    ),
    statistic: (isFocuse: boolean) => (
      <FontAwesome
        name="bar-chart"
        size={verticalScale(30)}
        color={isFocuse ? "#f97316" : "#999"}
      />
    ),
    wallet: (isFocuse: boolean) => (
      <FontAwesome
        name="google-wallet"
        size={verticalScale(30)}
        color={isFocuse ? "#f97316" : "#999"}
      />
    ),
    profile: (isFocuse: boolean) => (
      <FontAwesome
        name="user"
        size={verticalScale(30)}
        color={isFocuse ? "#f97316" : "#999"}
      />
    ),
  };
  return (
    <SafeAreaView>

    <View
      className="flex-row justify-around items-center w-full border-t"
      style={{
        height: Platform.OS == "ios" ? verticalScale(73) : verticalScale(55),
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className="justify-around items-center"
            style={{
              marginBottom:
                Platform.OS == "ios" ? verticalScale(10) : verticalScale(5),
            }}
          >
            {
                tabBarIcons[route.name] && tabBarIcons[route.name](isFocused)
            }
          </TouchableOpacity>
        );
      })}
    </View>
      </SafeAreaView>
  );
}
