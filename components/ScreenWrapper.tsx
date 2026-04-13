import { useTheme } from "@/contexts/ThemeContext";
import { ScreenWrapperProps } from "@/types";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, Platform, View } from "react-native";
const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  const { isDark, theme } = useTheme();
  let paddingTop = Platform.OS == "ios" ? height * 0.06 : 30;

  return (
    <View
      className={`flex-1`}
      style={[
        style,
        {
          paddingTop,
          backgroundColor: style?.backgroundColor ?? theme.background,
        },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </View>
  );
};

export default ScreenWrapper;
