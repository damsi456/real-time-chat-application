import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-app-theme") || "light",
    setTheme: (theme) => {
        localStorage.setItem("chat-app-theme", theme)
        set({ theme })
    }
})) 
