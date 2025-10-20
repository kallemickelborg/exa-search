import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("auto");
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    "light"
  );
  const [mounted, setMounted] = useState(false);

  const isDaytime = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 6 && hour < 18;
  };

  const getSystemTheme = (): "light" | "dark" => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  };

  const calculateEffectiveTheme = (currentTheme: Theme): "light" | "dark" => {
    if (currentTheme === "auto") {
      if (isDaytime()) {
        return "light";
      }
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && ["light", "dark", "auto"].includes(savedTheme)) {
      setThemeState(savedTheme);
    } else {
      setThemeState("auto");
    }
    setMounted(true);
  }, []);

  // Update effective theme when theme or time changes
  useEffect(() => {
    if (!mounted) return;

    const newEffectiveTheme = calculateEffectiveTheme(theme);
    setEffectiveTheme(newEffectiveTheme);

    // Update DOM
    const root = document.documentElement;
    if (newEffectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Save preference
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "auto") {
        const newEffectiveTheme = calculateEffectiveTheme("auto");
        setEffectiveTheme(newEffectiveTheme);
        const root = document.documentElement;
        if (newEffectiveTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  // Check time every minute for auto theme
  useEffect(() => {
    if (!mounted || theme !== "auto") return;

    const checkTime = () => {
      const newEffectiveTheme = calculateEffectiveTheme("auto");
      setEffectiveTheme(newEffectiveTheme);
      const root = document.documentElement;
      if (newEffectiveTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
