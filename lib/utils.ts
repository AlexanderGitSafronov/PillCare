import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { uk, ru, enUS } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEMO_USER_ID = "demo-user-001";

export function getDateLocale(lang: string) {
  switch (lang) {
    case "ru": return ru;
    case "en": return enUS;
    default: return uk;
  }
}

export function formatTime(time: string): string {
  return time;
}

export function formatRelativeDate(date: Date | string, lang: string = "uk"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  const locale = getDateLocale(lang);

  if (isToday(d)) return lang === "en" ? "Today" : lang === "ru" ? "Сегодня" : "Сьогодні";
  if (isTomorrow(d)) return lang === "en" ? "Tomorrow" : lang === "ru" ? "Завтра" : "Завтра";
  if (isYesterday(d)) return lang === "en" ? "Yesterday" : lang === "ru" ? "Вчера" : "Вчора";

  return format(d, "d MMMM", { locale });
}

export const MED_COLORS = [
  { value: "#4F8EF7", label: "Синій" },
  { value: "#34C759", label: "Зелений" },
  { value: "#FF9500", label: "Помаранчевий" },
  { value: "#FF3B30", label: "Червоний" },
  { value: "#AF52DE", label: "Фіолетовий" },
  { value: "#FF2D55", label: "Рожевий" },
  { value: "#5AC8FA", label: "Блакитний" },
  { value: "#FFCC00", label: "Жовтий" },
];

export const MED_ICONS = [
  "pill", "capsule", "syringe", "droplets", "heart",
  "sun", "moon", "leaf", "star", "zap",
];

export function getStreakMessage(streak: number, lang: string): string {
  if (lang === "en") {
    if (streak === 0) return "Start your streak!";
    if (streak === 1) return "Great start!";
    if (streak < 7) return `${streak} days in a row!`;
    if (streak < 30) return `Incredible! ${streak} days!`;
    return `Champion! ${streak} days!`;
  }
  if (lang === "ru") {
    if (streak === 0) return "Начните серию!";
    if (streak === 1) return "Отличное начало!";
    if (streak < 7) return `${streak} дней подряд!`;
    if (streak < 30) return `Невероятно! ${streak} дней!`;
    return `Чемпион! ${streak} дней!`;
  }
  if (streak === 0) return "Почніть серію!";
  if (streak === 1) return "Чудовий початок!";
  if (streak < 7) return `${streak} днів поспіль!`;
  if (streak < 30) return `Неймовірно! ${streak} днів!`;
  return `Чемпіон! ${streak} днів!`;
}
