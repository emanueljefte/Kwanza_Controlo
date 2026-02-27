import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme(); // 'light' ou 'dark'
  const [mode, setMode] = useState<ThemeMode>('system');

  // Determina o tema real baseado no modo escolhido
  const theme = mode === 'system' ? (systemColorScheme ?? 'light') : mode;

  // Carregar preferência salva ao iniciar
  useEffect(() => {
    const loadTheme = async () => {
      const savedMode = await AsyncStorage.getItem('@user_theme_mode');
      if (savedMode) setMode(savedMode as ThemeMode);
    };
    loadTheme();
  }, []);

  // Salvar preferência quando mudar
  const updateMode = async (newMode: ThemeMode) => {
    setMode(newMode);
    await AsyncStorage.setItem('@user_theme_mode', newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode: updateMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  return context;
};