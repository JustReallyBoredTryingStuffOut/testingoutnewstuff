import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme, AppState, AppStateStatus } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/colors";

// Create context
interface ThemeContextType {
  colors: ReturnType<typeof getColors>;
  isDark: boolean;
  toggleTheme: () => void;
  setColorScheme: (scheme: import("@/store/themeStore").ColorScheme) => void;
  currentColorScheme: import("@/store/themeStore").ColorScheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, colorScheme, setTheme, setColorScheme } = useThemeStore();
  const deviceTheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(
    theme === "system" ? (deviceTheme === "dark" ? "dark" : "light") : theme
  );
  
  // Update current theme when theme or device theme changes
  useEffect(() => {
    if (theme === "system") {
      setCurrentTheme(deviceTheme === "dark" ? "dark" : "light");
    } else {
      setCurrentTheme(theme);
    }
  }, [theme, deviceTheme]);
  
  // Listen for app state changes to refresh theme when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Force a re-check of the theme when app becomes active
        if (theme === "system") {
          setCurrentTheme(deviceTheme === "dark" ? "dark" : "light");
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [theme, deviceTheme]);
  
  // Get colors based on current theme and color scheme
  const colors = getColors(currentTheme, colorScheme);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      // If system, set to opposite of current system theme
      setTheme(deviceTheme === "dark" ? "light" : "dark");
    }
  };
  
  const value = {
    colors,
    isDark: currentTheme === "dark",
    toggleTheme,
    setColorScheme,
    currentColorScheme: colorScheme,
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};