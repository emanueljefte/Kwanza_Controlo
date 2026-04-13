import { useTheme } from "@/contexts/ThemeContext";
import { InputProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { EyeClosedIcon, EyeIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function Input(props: InputProps) {
  const { theme, isDark } = useTheme();
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
          backgroundColor: theme.navBackground,
          borderColor: isFocused ? theme.primary : "transparent",
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
              color: isFocused ? theme.primary : theme.text,
              size: verticalScale(20),
            },
          )}
        </View>
      )}

      <TextInput
        style={[styles.input, { color: theme.title }]}
        placeholderTextColor={isDark ? "#666" : "#9CA3AF"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={rest.inputRef}
        selectionColor={theme.primary}
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
            <EyeIcon size={verticalScale(20)} color={theme.text} />
          ) : (
            <EyeClosedIcon
              size={verticalScale(20)}
              color={isFocused ? theme.primary : theme.text}
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
