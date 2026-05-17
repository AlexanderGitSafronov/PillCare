"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { I18nContext } from "@/lib/i18n";
import { translations } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import type { Language } from "@/lib/i18n";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/ui/cookie-consent";

function I18nProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <I18nContext.Provider value={{ t: translations.uk, lang: "uk", setLang: () => {} }}>
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider
      value={{
        t: translations[language as Language],
        lang: language as Language,
        setLang: (lang: Language) => setLanguage(lang),
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        {children}
        <CookieConsent />
        <Toaster />
      </I18nProvider>
    </ThemeProvider>
  );
}
