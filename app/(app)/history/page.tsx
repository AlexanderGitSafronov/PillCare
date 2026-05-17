"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { CheckCircle2, XCircle, Clock, SkipForward } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { useI18n } from "@/lib/i18n";
import { getDateLocale, formatRelativeDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  medicationName: string;
  color: string;
  dosage: string;
  unit: string;
  scheduledAt: string;
  takenAt?: string;
  status: "TAKEN" | "MISSED" | "SKIPPED" | "PENDING";
}

const STATUS_ICONS = {
  TAKEN: CheckCircle2,
  MISSED: XCircle,
  SKIPPED: SkipForward,
  PENDING: Clock,
};
const STATUS_COLORS = {
  TAKEN: "text-green-500",
  MISSED: "text-red-500",
  SKIPPED: "text-yellow-500",
  PENDING: "text-blue-400",
};

export default function HistoryPage() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/history?limit=100");
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        }
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = items.filter((item) => {
    if (filter === "all") return true;
    return item.status.toLowerCase() === filter;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, HistoryItem[]>>((acc, item) => {
    const dateKey = format(parseISO(item.scheduledAt), "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // Stats
  const total = items.length;
  const taken = items.filter((i) => i.status === "TAKEN").length;
  const consistency = total > 0 ? Math.round((taken / total) * 100) : 0;

  return (
    <div>
      <PageHeader title={t.history.title} />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: t.progress.consistency, value: `${consistency}%`, color: "text-primary" },
          { label: t.history.taken, value: taken.toString(), color: "text-green-500" },
          { label: t.history.missed, value: items.filter((i) => i.status === "MISSED").length.toString(), color: "text-red-500" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 text-center">
              <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <Tabs value={filter} onValueChange={setFilter} className="mb-5">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">{t.history.filter.all}</TabsTrigger>
          <TabsTrigger value="taken" className="flex-1">{t.history.filter.taken}</TabsTrigger>
          <TabsTrigger value="missed" className="flex-1">{t.history.filter.missed}</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">{t.history.filter.pending}</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : sortedDates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="font-medium">{t.history.noHistory}</p>
          <p className="text-sm text-muted-foreground mt-1">{t.history.noHistoryDesc}</p>
        </motion.div>
      ) : (
        <div className="space-y-5">
          {sortedDates.map((dateKey) => (
            <div key={dateKey}>
              <p className="text-sm font-medium text-muted-foreground mb-2 px-1 capitalize">
                {formatRelativeDate(parseISO(dateKey), lang)}
              </p>
              <div className="space-y-2">
                {grouped[dateKey].map((item, i) => {
                  const Icon = STATUS_ICONS[item.status];
                  const color = STATUS_COLORS[item.status];

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 bg-card rounded-2xl border p-3.5"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.medicationName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.medicationName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.dosage} {item.unit} · {format(parseISO(item.scheduledAt), "HH:mm")}
                          {item.takenAt && ` · ${t.history.takenAt} ${format(parseISO(item.takenAt), "HH:mm")}`}
                        </p>
                      </div>
                      <Icon className={cn("w-5 h-5 flex-shrink-0", color)} />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
