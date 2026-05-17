"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "uk" | "ru" | "en";
type Theme = "light" | "dark" | "system";

interface AppState {
  language: Language;
  theme: Theme;
  userId: string;
  notificationsEnabled: boolean;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: "uk",
      theme: "system",
      userId: "demo-user-001",
      notificationsEnabled: false,
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
    }),
    {
      name: "pillcare-settings",
    }
  )
);
