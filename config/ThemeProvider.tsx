import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeStore } from "@/stores/themeStore";
import { useEffect } from "react";
import { View } from "react-native";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const { updateTheme, isDark, mode } = useThemeStore();

  useEffect(() => {
    updateTheme(systemColorScheme || "light");
  }, [systemColorScheme, mode]);

  return (
    <View className={isDark ? "bg-gray-900" : "bg-white"} style={{ flex: 1 }}>
      {children}
    </View>
  );
}
