import { Colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { InputProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { EyeClosedIcon, EyeIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function Input(props: InputProps) {
  const { theme } = useTheme();
  const activeColors = Colors[theme];
  const { secureTextEntry, ...rest } = props;

  const [isFocused, setIsFocused] = useState(false);
  // Estado para alternar entre mostrar/esconder senha
  const [showPassword, setShowPassword] = useState(false);

  // Verifica se o componente recebeu a prop de senha originalmente
  const isPasswordField = props.secureTextEntry;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "dark" ? activeColors.navBackground : "#F3F4F6",
          borderColor: isFocused ? Colors.primary : "transparent",
          borderWidth: 1.5,
        },
      ]}
    >
      {/* Ícone Inicial (ex: E-mail, Cadeado) */}
      {props.icon && (
        <View style={styles.iconContainer}>
          {React.cloneElement(
            props.icon as React.ReactElement<{ color?: string; size?: number }>,
            {
              color: isFocused ? Colors.primary : activeColors.text,
              size: verticalScale(20),
            },
          )}
        </View>
      )}

      <TextInput
        style={[styles.input, { color: activeColors.title }]}
        placeholderTextColor={theme === "dark" ? "#666" : "#9CA3AF"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={rest.inputRef}
        selectionColor={Colors.primary}
        // Se for senha, o estado showPassword controla a visibilidade
        {...rest}
        secureTextEntry={isPasswordField && !showPassword}
      />

      {/* Ícone de Olhinho - Só aparece se secureTextEntry for true */}
      {isPasswordField && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
          activeOpacity={0.7}
        >
          {showPassword ? (
            <EyeIcon size={verticalScale(20)} color={activeColors.text} />
          ) : (
            <EyeClosedIcon
              size={verticalScale(20)}
              color={isFocused ? Colors.primary : activeColors.text}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(56),
    borderRadius: verticalScale(16),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(12),
  },
  iconContainer: {
    marginRight: scale(10),
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: verticalScale(15),
    fontWeight: "500",
    height: "100%",
  },
  eyeIcon: {
    padding: scale(5),
    marginLeft: scale(5),
  },
});
