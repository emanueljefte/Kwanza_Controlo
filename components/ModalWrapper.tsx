import { useTheme } from "@/contexts/ThemeContext";
import { ModalWrapperProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { Platform, View } from "react-native";

const isIOS = Platform.OS == "ios";
export default function ModalWrapper({
  style,
  children,
  bg,
}: ModalWrapperProps) {
  const { theme } = useTheme();
  return (
    <View
      className="flex-1"
      style={[
        {
          backgroundColor: theme.background || bg,
          paddingTop: isIOS ? verticalScale(15) : 50,
          paddingBottom: isIOS ? verticalScale(20) : verticalScale(50),
        },
        style && style,
      ]}
    >
      {children}
    </View>
  );
}
