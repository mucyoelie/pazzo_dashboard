import React, { createContext, useContext, useState, useEffect} from "react";
import type { ReactNode } from "react"; // ✅ type-only import

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // load initial value from localStorage if available
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Apply Tailwind dark class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    // save preference
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

