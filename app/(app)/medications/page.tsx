"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pill } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/PageHeader";
import { MedCard } from "@/components/medications/MedCard";
import { useI18n } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  unit: string;
  color: string;
  icon: string;
  notes?: string;
  isActive: boolean;
  schedules: Array<{
    frequency: string;
    times: string[];
  }>;
}

export default function MedicationsPage() {
  const { t } = useI18n();
  const { userId } = useAppStore();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMedications = async () => {
    try {
      const res = await fetch(`/api/medications?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMedications(data);
      }
    } catch {
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [userId]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/medications/${id}`, { method: "DELETE" });
      setMedications((prev) => prev.filter((m) => m.id !== id));
    } catch {}
  };

  const filtered = medications.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title={t.medications.title}
        action={
          <Button asChild size="icon-lg">
            <Link href="/medications/add">
              <Plus className="w-5 h-5" />
            </Link>
          </Button>
        }
      />

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t.medications.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Pill className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="font-semibold text-lg mb-2">
            {search ? t.common.noData : t.medications.noMedications}
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            {t.medications.noMedicationsDesc}
          </p>
          {!search && (
            <Button asChild>
              <Link href="/medications/add">
                <Plus className="w-4 h-4 mr-2" />
                {t.medications.add}
              </Link>
            </Button>
          )}
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {filtered.map((med, i) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: i * 0.05 }}
              >
                <MedCard
                  medication={med}
                  onDelete={() => handleDelete(med.id)}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
