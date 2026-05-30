"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThemePreference } from "@/lib/types";

type ThemeContextValue = {
  theme: ThemePreference;
  /** False during SSR + first client render; true after mount. Gate theme-dependent UI on this to avoid hydration mismatches. */
  mounted: boolean;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = "social-vault-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    // The no-flash layout script already resolved the theme onto <html data-theme>.
    const applied = document.documentElement.dataset.theme as ThemePreference | undefined;
    if (applied === "dark" || applied === "light") {
      return applied;
    }

    const saved = window.localStorage.getItem(storageKey) as ThemePreference | null;
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Standard hydration gate: flip to mounted after first client render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  function setTheme(nextTheme: ThemePreference) {
    setThemeState(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  const value = { theme, mounted, setTheme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
