"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Clock, AlarmClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";

interface MedCardProps {
  medication: {
    id: string;
    name: string;
    dosage: string;
    unit: string;
    color: string;
    notes?: string;
    isActive: boolean;
    schedules: Array<{ frequency: string; times: string[] }>;
  };
  onDelete: () => void;
}

export function MedCard({ medication, onDelete }: MedCardProps) {
  const { t } = useI18n();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const schedule = medication.schedules[0];
  const frequencyLabel = schedule
    ? t.medications.frequency[schedule.frequency as keyof typeof t.medications.frequency] ?? schedule.frequency
    : "";
  const times = schedule?.times?.join(", ") ?? "";

  return (
    <>
      <Card className="card-hover">
        <CardContent className="p-4 flex items-center gap-4">
          {/* Color avatar */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: medication.color }}
          >
            {medication.name[0].toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-base truncate">{medication.name}</p>
              {!medication.isActive && (
                <span className="text-xs text-muted-foreground">(неактивне)</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {medication.dosage} {medication.unit}
            </p>
            {schedule && (
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AlarmClock className="w-3.5 h-3.5" />
                  {frequencyLabel}
                </div>
                {times && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {times}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1 flex-shrink-0">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <Link href={`/medications/${medication.id}`}>
                <Pencil className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.medications.deleteConfirm}</DialogTitle>
            <DialogDescription>{t.medications.deleteConfirmDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {t.common.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
            >
              {t.common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
