"use client"
import { useState, useEffect } from "react";
 
export default function useDarkMode() {
    const [theme, setTheme] = useState("");
    const colorTheme = theme === "dark" ? "light" : "dark";

    useEffect(()=>{
        setTheme(localStorage.getItem("theme")!);
    }, [])
 
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);

        if(theme !== ""){
            root.classList.add(theme);
        }else{
            root.classList.add("light")
        }
        
        localStorage.setItem('theme', theme);
    }, [theme, colorTheme]);
 
    return [colorTheme, setTheme]
}
