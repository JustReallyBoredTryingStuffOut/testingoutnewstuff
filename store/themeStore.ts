import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorSchemeName, useColorScheme } from "react-native";

export type ThemeType = "light" | "dark" | "system";
export type ColorScheme = "blue" | "green" | "purple" | "orange" | "pink" | "pastel" | "monochrome" | "nature" | "vibrant" | "minimal";

interface ThemeState {
  theme: ThemeType;
  colorScheme: ColorScheme;
  
  // Actions
  setTheme: (theme: ThemeType) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  
  // Computed
  getCurrentTheme: (deviceTheme: ColorSchemeName) => "light" | "dark";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      colorScheme: "blue",
      
      setTheme: (theme) => set({ theme }),
      
      setColorScheme: (colorScheme) => set({ colorScheme }),
      
      getCurrentTheme: (deviceTheme) => {
        const { theme } = get();
        
        if (theme === "system") {
          // Use the device's color scheme
          return deviceTheme === "dark" ? "dark" : "light";
        }
        
        return theme;
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper hook to get the current theme
export function useAppTheme(): "light" | "dark" {
  const { theme } = useThemeStore();
  const deviceTheme = useColorScheme();
  
  if (theme === "system") {
    return deviceTheme === "dark" ? "dark" : "light";
  }
  
  return theme;
}