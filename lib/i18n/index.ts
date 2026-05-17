"use client";

import { createContext, useContext } from "react";
import { uk } from "./uk";
import { ru } from "./ru";
import { en } from "./en";
import type { Translations } from "./uk";

export type Language = "uk" | "ru" | "en";

export const translations: Record<Language, Translations> = { uk, ru, en };

export const I18nContext = createContext<{
  t: Translations;
  lang: Language;
  setLang: (lang: Language) => void;
}>({
  t: uk,
  lang: "uk",
  setLang: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}

export const LANGUAGE_NAMES: Record<Language, string> = {
  uk: "Українська",
  ru: "Русский",
  en: "English",
};

export type { Translations };
