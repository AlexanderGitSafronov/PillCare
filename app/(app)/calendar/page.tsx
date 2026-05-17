"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isToday, getDay, addMonths, subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { useI18n } from "@/lib/i18n";
import { getDateLocale } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DayStats {
  date: string;
  taken: number;
  missed: number;
  pending: number;
  total: number;
}

interface DayEvent {
  medicationId: string;
  name: string;
  color: string;
  dosage: string;
  unit: string;
  time: string;
  status: string;
}

export default function CalendarPage() {
  const { t, lang } = useI18n();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [monthStats, setMonthStats] = useState<DayStats[]>([]);
  const [dayEvents, setDayEvents] = useState<DayEvent[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const locale = getDateLocale(lang);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const from = format(startOfMonth(currentMonth), "yyyy-MM-dd");
        const to = format(endOfMonth(currentMonth), "yyyy-MM-dd");
        const res = await fetch(`/api/calendar?from=${from}&to=${to}`);
        if (res.ok) setMonthStats(await res.json());
      } catch {
        setMonthStats([]);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [currentMonth]);

  useEffect(() => {
    const fetchDay = async () => {
      setLoadingEvents(true);
      try {
        const date = format(selectedDay, "yyyy-MM-dd");
        const res = await fetch(`/api/history?date=${date}`);
        if (res.ok) {
          const data = await res.json();
          setDayEvents(data.items || []);
        }
      } catch {
        setDayEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchDay();
  }, [selectedDay]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Pad start
  const firstDay = getDay(startOfMonth(currentMonth));
  const padStart = firstDay === 0 ? 6 : firstDay - 1;

  const getDayStats = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    return monthStats.find((s) => s.date === key);
  };

  const getDotColor = (stats?: DayStats) => {
    if (!stats || stats.total === 0) return null;
    const rate = stats.taken / stats.total;
    if (rate === 1) return "bg-green-500";
    if (rate >= 0.5) return "bg-orange-400";
    if (stats.missed > 0) return "bg-red-500";
    return "bg-blue-400";
  };

  const weekdays = lang === "en"
    ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    : lang === "ru"
    ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
    : ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  return (
    <div>
      <PageHeader title={t.calendar.title} />

      {/* Month navigation */}
      <Card className="mb-5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="font-semibold text-base capitalize">
              {format(currentMonth, "LLLL yyyy", { locale })}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekdays.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: padStart }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {days.map((day) => {
              const stats = getDayStats(day);
              const dotColor = getDotColor(stats);
              const isSel = isSameDay(day, selectedDay);
              const isCurrentDay = isToday(day);

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "relative flex flex-col items-center justify-center h-10 rounded-xl text-sm transition-colors",
                    isSel && "bg-primary text-primary-foreground font-semibold",
                    !isSel && isCurrentDay && "border-2 border-primary font-semibold",
                    !isSel && !isCurrentDay && "hover:bg-muted"
                  )}
                >
                  {format(day, "d")}
                  {dotColor && (
                    <div
                      className={cn(
                        "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                        dotColor,
                        isSel && "bg-white/70"
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-3 justify-center">
            {[
              { color: "bg-green-500", label: t.calendar.taken },
              { color: "bg-orange-400", label: "50%+" },
              { color: "bg-red-500", label: t.calendar.missed },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected day events */}
      <div>
        <h3 className="font-semibold mb-3 capitalize">
          {format(selectedDay, "d MMMM", { locale })}
          {isToday(selectedDay) && (
            <Badge variant="outline" className="ml-2 text-xs">
              {t.calendar.today}
            </Badge>
          )}
        </h3>

        {loadingEvents ? (
          <div className="space-y-2">
            {[1, 2].map((i) => <div key={i} className="h-14 rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : dayEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">{t.calendar.noEvents}</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {dayEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-card rounded-2xl border p-3.5"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: event.color }}
                >
                  {event.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.dosage} {event.unit} · {event.time}
                  </p>
                </div>
                {event.status === "TAKEN" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : event.status === "MISSED" ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <Clock className="w-5 h-5 text-blue-400" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
