"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor, Bell, BellOff, Globe, Info, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/PageHeader";
import { useI18n, LANGUAGE_NAMES } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/i18n";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

const THEMES = [
  { id: "light", icon: Sun, labelKey: "themeLight" as const },
  { id: "dark", icon: Moon, labelKey: "themeDark" as const },
  { id: "system", icon: Monitor, labelKey: "themeSystem" as const },
];

const LANGUAGES: Language[] = ["uk", "ru", "en"];

export default function SettingsPage() {
  const { t } = useI18n();
  const { setTheme: setNextTheme, theme: currentTheme } = useTheme();
  const { language, setLanguage, notificationsEnabled, setNotificationsEnabled, userId } = useAppStore();
  const [userName, setUserName] = useState("");
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | null>(
    typeof Notification !== "undefined" ? Notification.permission : null
  );

  const handleRequestNotifications = async () => {
    if (!("Notification" in window)) {
      toast({ title: t.common.error, description: "Ваш браузер не підтримує сповіщення", variant: "destructive" });
      return;
    }
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
    if (permission !== "granted") {
      toast({ title: t.settings.permissionDenied, variant: "destructive" });
      return;
    }

    try {
      // Register push subscription via service worker
      if ("serviceWorker" in navigator && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        const sw = await navigator.serviceWorker.ready;
        const existing = await sw.pushManager.getSubscription();
        const subscription = existing ?? await sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY).buffer as ArrayBuffer,
        });
        await fetch("/api/notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, subscription }),
        });
      }
      setNotificationsEnabled(true);
      toast({ title: t.settings.permissionGranted, variant: "default" });
    } catch (err) {
      console.error("Push subscription failed:", err);
      // Permission was granted but subscription failed — still mark enabled
      setNotificationsEnabled(true);
      toast({ title: t.settings.permissionGranted, variant: "default" });
    }
  };

  const handleThemeChange = (themeId: string) => {
    setNextTheme(themeId);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    toast({ title: t.settings.saved });
  };

  return (
    <div>
      <PageHeader title={t.settings.title} />

      <div className="space-y-5">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">{t.settings.profile}</h3>
              <div>
                <Label htmlFor="username">{t.settings.name}</Label>
                <Input
                  id="username"
                  className="mt-1.5"
                  placeholder={t.settings.namePlaceholder}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <Button className="mt-3 w-full" variant="outline" onClick={() => toast({ title: t.settings.saved })}>
                {t.settings.save}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">{t.settings.notifications}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {notificationsEnabled
                    ? <Bell className="w-5 h-5 text-primary" />
                    : <BellOff className="w-5 h-5 text-muted-foreground" />}
                  <div>
                    <p className="font-medium text-sm">{t.settings.notificationsEnabled}</p>
                    <p className="text-xs text-muted-foreground">{t.settings.notificationsDesc}</p>
                  </div>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>

              {notifPermission !== "granted" && (
                <Button
                  className="mt-4 w-full gap-2"
                  variant="outline"
                  onClick={handleRequestNotifications}
                >
                  <Bell className="w-4 h-4" />
                  {t.settings.requestPermission}
                </Button>
              )}

              {notifPermission === "granted" && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-3 flex items-center gap-2">
                  <span>✓</span> {t.settings.permissionGranted}
                </p>
              )}

              {notifPermission === "denied" && (
                <p className="text-sm text-red-500 mt-3">
                  {t.settings.permissionDenied}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">{t.settings.language}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={cn(
                      "py-2.5 rounded-xl text-sm font-medium border transition-colors",
                      language === lang
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {LANGUAGE_NAMES[lang]}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">{t.settings.theme}</h3>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 py-3 rounded-xl text-sm font-medium border transition-colors",
                        currentTheme === theme.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {t.settings[theme.labelKey]}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">{t.settings.about}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.settings.version}</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">App</span>
                  <span className="font-medium">PillCare PWA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
