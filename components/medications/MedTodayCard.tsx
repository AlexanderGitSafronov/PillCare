"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, SkipForward, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

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

interface Props {
  med: TodayMed;
  onTaken: () => void;
  onSkipped: () => void;
}

export function MedTodayCard({ med, onTaken, onSkipped }: Props) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const handleTaken = async () => {
    setLoading(true);
    await onTaken();
    setLoading(false);
  };

  const scheduledTime = format(new Date(med.scheduledAt), "HH:mm");
  const isPast = new Date(med.scheduledAt) < new Date();

  const statusVariant =
    med.status === "TAKEN" ? "taken"
    : med.status === "MISSED" ? "missed"
    : med.status === "SKIPPED" ? "skipped"
    : "pending";

  const statusText =
    med.status === "TAKEN" ? t.dashboard.taken
    : med.status === "MISSED" ? t.dashboard.missed
    : med.status === "SKIPPED" ? t.medications.form.cancel
    : t.dashboard.upcoming;

  return (
    <motion.div
      layout
      className={cn(
        "bg-card rounded-2xl border shadow-sm p-4 flex items-center gap-4",
        med.status === "TAKEN" && "opacity-60"
      )}
    >
      {/* Color dot / icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
        style={{ backgroundColor: med.color }}
      >
        {med.status === "TAKEN" ? (
          <CheckCircle2 className="w-6 h-6" />
        ) : (
          med.name[0].toUpperCase()
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base truncate">{med.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-muted-foreground">
            {med.dosage} {med.unit}
          </span>
          <span className="text-muted-foreground">·</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {scheduledTime}
          </div>
        </div>
      </div>

      {/* Action */}
      {med.status === "PENDING" || med.status === "MISSED" ? (
        <div className="flex gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 text-muted-foreground"
            onClick={onSkipped}
            disabled={loading}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="success"
            className="h-9 px-3 gap-1.5"
            onClick={handleTaken}
            disabled={loading}
          >
            <CheckCircle2 className="w-4 h-4" />
            {t.dashboard.markTaken}
          </Button>
        </div>
      ) : (
        <Badge variant={statusVariant}>{statusText}</Badge>
      )}
    </motion.div>
  );
}
