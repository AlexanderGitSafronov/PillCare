"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { MED_COLORS } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const FREQUENCIES = ["DAILY", "TWICE_DAILY", "THREE_TIMES_DAILY", "WEEKLY", "CUSTOM"] as const;
const DEFAULT_TIMES: Record<string, string[]> = {
  DAILY: ["08:00"],
  TWICE_DAILY: ["08:00", "20:00"],
  THREE_TIMES_DAILY: ["08:00", "13:00", "20:00"],
  WEEKLY: ["08:00"],
  CUSTOM: ["08:00"],
};

interface MedFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MedForm({ initialData, onSuccess, onCancel }: MedFormProps) {
  const { t } = useI18n();
  const { userId } = useAppStore();

  const schedule = initialData?.schedules?.[0];

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    dosage: initialData?.dosage ?? "",
    unit: initialData?.unit ?? t.medications.units[0],
    color: initialData?.color ?? MED_COLORS[0].value,
    notes: initialData?.notes ?? "",
    stock: initialData?.stock?.toString() ?? "",
    frequency: (schedule?.frequency ?? "DAILY") as typeof FREQUENCIES[number],
    times: schedule?.times ?? ["08:00"],
    weekdays: schedule?.weekdays ?? [],
  });
  const [saving, setSaving] = useState(false);

  const setField = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFrequencyChange = (freq: typeof FREQUENCIES[number]) => {
    setForm((prev) => ({
      ...prev,
      frequency: freq,
      times: DEFAULT_TIMES[freq],
    }));
  };

  const addTime = () => {
    setForm((prev) => ({ ...prev, times: [...prev.times, "12:00"] }));
  };

  const removeTime = (i: number) => {
    setForm((prev) => ({
      ...prev,
      times: prev.times.filter((_: string, idx: number) => idx !== i),
    }));
  };

  const updateTime = (i: number, val: string) => {
    setForm((prev) => ({
      ...prev,
      times: prev.times.map((t: string, idx: number) => (idx === i ? val : t)),
    }));
  };

  const toggleWeekday = (day: number) => {
    setForm((prev) => ({
      ...prev,
      weekdays: prev.weekdays.includes(day)
        ? prev.weekdays.filter((d: number) => d !== day)
        : [...prev.weekdays, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.dosage.trim()) {
      toast({ title: t.common.error, description: "Заповніть назву та дозування", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const body = {
        userId,
        name: form.name,
        dosage: form.dosage,
        unit: form.unit,
        color: form.color,
        notes: form.notes || null,
        stock: form.stock ? parseInt(form.stock) : null,
        schedule: {
          frequency: form.frequency,
          times: form.times,
          weekdays: form.weekdays,
        },
      };

      const url = initialData ? `/api/medications/${initialData.id}` : "/api/medications";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast({ title: t.settings.saved, variant: "default" });
        onSuccess();
      } else {
        throw new Error("Failed");
      }
    } catch {
      toast({ title: t.common.error, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Basic info */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <Label htmlFor="name">{t.medications.form.name} *</Label>
            <Input
              id="name"
              className="mt-1.5"
              placeholder={t.medications.form.namePlaceholder}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="dosage">{t.medications.form.dosage} *</Label>
              <Input
                id="dosage"
                className="mt-1.5"
                placeholder={t.medications.form.dosagePlaceholder}
                value={form.dosage}
                onChange={(e) => setField("dosage", e.target.value)}
                type="number"
                min="0"
                required
              />
            </div>
            <div className="w-32">
              <Label>{t.medications.form.unit}</Label>
              <Select value={form.unit} onValueChange={(v) => setField("unit", v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {t.medications.units.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">{t.medications.form.notes}</Label>
            <Input
              id="notes"
              className="mt-1.5"
              placeholder={t.medications.form.notesPlaceholder}
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Color picker */}
      <Card>
        <CardContent className="p-5">
          <Label>{t.medications.form.color}</Label>
          <div className="flex gap-2.5 mt-3 flex-wrap">
            {MED_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setField("color", c.value)}
                className={cn(
                  "w-9 h-9 rounded-full transition-transform active:scale-90",
                  form.color === c.value && "ring-2 ring-offset-2 ring-foreground scale-110"
                )}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <Label>{t.medications.form.schedule}</Label>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              {t.medications.form.frequency}
            </Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FREQUENCIES.map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => handleFrequencyChange(freq)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors text-left",
                    form.frequency === freq
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  {t.medications.frequency[freq]}
                </button>
              ))}
            </div>
          </div>

          {/* Weekdays (for WEEKLY/CUSTOM) */}
          {(form.frequency === "WEEKLY" || form.frequency === "CUSTOM") && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                {t.medications.form.weekdays}
              </Label>
              <div className="flex gap-2">
                {t.medications.weekdays.map((day, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleWeekday(i)}
                    className={cn(
                      "w-9 h-9 rounded-xl text-xs font-medium border transition-colors",
                      form.weekdays.includes(i)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Times */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">
                {t.medications.form.times}
              </Label>
              <button
                type="button"
                onClick={addTime}
                className="text-xs text-primary font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.medications.form.addTime}
              </button>
            </div>
            <div className="space-y-2">
              {form.times.map((time: string, i: number) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => updateTime(i, e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {form.times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTime(i)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock */}
      <Card>
        <CardContent className="p-5">
          <Label htmlFor="stock">{t.medications.form.stock}</Label>
          <Input
            id="stock"
            className="mt-1.5"
            placeholder={t.medications.form.stockPlaceholder}
            value={form.stock}
            onChange={(e) => setField("stock", e.target.value)}
            type="number"
            min="0"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 pb-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          {t.medications.form.cancel}
        </Button>
        <Button type="submit" className="flex-1" disabled={saving}>
          {saving ? t.medications.form.saving : t.medications.form.save}
        </Button>
      </div>
    </motion.form>
  );
}
