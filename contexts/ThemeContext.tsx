import { Colors } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext({
  theme: Colors.dark,
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Carregar preferência salva
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("@user_theme_mode");

      if (savedTheme) {
        setIsDark(savedTheme === "dark");
      } else {
        setIsDark(systemColorScheme === "dark");
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    await AsyncStorage.setItem("@user_theme_mode", newMode ? "dark" : "light");
  };

  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
