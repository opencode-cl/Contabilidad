import { useContext, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { ThemeContext } from "../Providers/darkModeContext";
 
export default function DarkModeSwitcher() {

    const { toggleTheme, theme } = useContext(ThemeContext);
 
    return (
        <>
            <DarkModeSwitch
                checked={theme==="dark"}
                onChange={toggleTheme}
                size={30}
            />
        </>
    );
}
