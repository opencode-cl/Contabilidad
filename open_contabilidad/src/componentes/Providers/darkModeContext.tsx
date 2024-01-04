"use client"
import { ReactNode, useState, useEffect } from "react";
import React from "react";
import { createDarkTheme } from "@/globals/tableThemes";

type ContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export const ThemeContext = React.createContext<ContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

interface themeProviderProps{
    children: ReactNode
}

createDarkTheme();

export const ThemeProvider: React.FC<themeProviderProps> = ({ children }): JSX.Element => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      // Si el tema almacenado en localStorage es "light", lo usa; de lo contrario, usa "light" como predeterminado.
      return (localStorage.getItem("ui.theme") as "light" | "dark") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
      try {
        const val = localStorage.getItem("ui.theme");
        const root = window.document.documentElement;
        root.classList.remove("light");
        root.classList.remove("dark");
        root.classList.add(val!);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
  }, [theme]);

  const toggleTheme = (): void => {
    try {
      const val = theme === "light" ? "dark" : "light";
      setTheme(val);
      localStorage.setItem("ui.theme", val);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
  
  export default ThemeProvider;