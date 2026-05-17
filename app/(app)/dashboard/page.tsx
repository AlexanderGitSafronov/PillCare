"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Plus, Flame, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { getDateLocale, getStreakMessage } from "@/lib/utils";
import { MedTodayCard } from "@/components/medications/MedTodayCard";
import { ConfettiEffect } from "@/components/ui/confetti";

interface TodayMed {
  historyId: string;
  medicationId: string;
  name: string;
  dosage: string;
  unit: string;
  color: string;
  scheduledAt: string;
  status: "PENDING" | "TAKEN" | "SKIPPED" | "MISSED";
}

interface DashboardData {
  todayMeds: TodayMed[];
  takenCount: number;
  missedCount: number;
  pendingCount: number;
  totalCount: number;
  streak: number;
}

function getGreeting(lang: string): string {
  const hour = new Date().getHours();
  if (lang === "en") {
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }
  if (lang === "ru") {
    if (hour < 12) return "Доброе утро";
    if (hour < 17) return "Добрый день";
    return "Добрый вечер";
  }
  if (hour < 12) return "Добрий ранок";
  if (hour < 17) return "Добрий день";
  return "Добрий вечір";
}

export default function DashboardPage() {
  const { t, lang } = useI18n();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch {
      // Use demo data when API unavailable
      setData({
        todayMeds: [],
        takenCount: 0,
        missedCount: 0,
        pendingCount: 0,
        totalCount: 0,
        streak: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleMarkTaken = async (historyId: string) => {
    try {
      await fetch(`/api/history/${historyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "TAKEN", takenAt: new Date().toISOString() }),
      });
      await fetchDashboard();

      if (data && data.takenCount + 1 === data.totalCount) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch {}
  };

  const handleMarkSkipped = async (historyId: string) => {
    try {
      await fetch(`/api/history/${historyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SKIPPED" }),
      });
      await fetchDashboard();
    } catch {}
  };

  const today = format(new Date(), "d MMMM yyyy", { locale: getDateLocale(lang) });
  const progressPct = data?.totalCount ? Math.round((data.takenCount / data.totalCount) * 100) : 0;
  const allDone = (data?.totalCount ?? 0) > 0 && data?.takenCount === data?.totalCount;

  return (
    <div>
      {showConfetti && <ConfettiEffect />}

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-muted-foreground text-sm">{today}</p>
        <h1 className="text-2xl font-bold mt-0.5">{getGreeting(lang)} 👋</h1>
      </motion.div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="mb-4 overflow-hidden bg-gradient-to-br from-primary/10 to-violet-500/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.dashboard.progress}</p>
                <p className="text-3xl font-bold mt-0.5">{progressPct}%</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <div className="flex items-center gap-1">
                    <Flame className={`w-5 h-5 ${(data?.streak ?? 0) > 0 ? "text-orange-500 streak-fire" : "text-muted-foreground"}`} />
                    <span className="font-bold text-lg">{data?.streak ?? 0}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t.dashboard.streakDays}</p>
                <p className="text-xs text-orange-500 font-medium mt-0.5">
                  {getStreakMessage(data?.streak ?? 0, lang)}
                </p>
              </div>
            </div>
            <Progress value={progressPct} className="h-2.5" />
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">{data?.takenCount ?? 0}</span>
                <span className="text-xs text-muted-foreground">{t.dashboard.taken}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">{data?.missedCount ?? 0}</span>
                <span className="text-xs text-muted-foreground">{t.dashboard.missed}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">{data?.pendingCount ?? 0}</span>
                <span className="text-xs text-muted-foreground">{t.dashboard.upcoming}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* All done message */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4"
          >
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <p className="text-green-700 dark:text-green-300 font-semibold">
                  {t.dashboard.allTaken}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Today's Meds */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-base">{t.dashboard.todayMeds}</h2>
        <Button asChild size="sm" className="gap-1.5 h-9">
          <Link href="/medications/add">
            <Plus className="w-4 h-4" />
            {t.medications.add}
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : data?.todayMeds.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💊</span>
          </div>
          <p className="font-medium text-lg mb-1">{t.dashboard.noMedications}</p>
          <p className="text-muted-foreground text-sm mb-6">{t.dashboard.noMedsToday}</p>
          <Button asChild>
            <Link href="/medications/add">
              <Plus className="w-4 h-4 mr-2" />
              {t.dashboard.addFirstMed}
            </Link>
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {data?.todayMeds.map((med, i) => (
            <motion.div
              key={med.historyId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <MedTodayCard
                med={med}
                onTaken={() => handleMarkTaken(med.historyId)}
                onSkipped={() => handleMarkSkipped(med.historyId)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
