"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { MedForm } from "@/components/medications/MedForm";
import { useI18n } from "@/lib/i18n";

export default function EditMedicationPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMed = async () => {
      try {
        const res = await fetch(`/api/medications/${params.id}`);
        if (res.ok) {
          setMedication(await res.json());
        }
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchMed();
  }, [params.id]);

  if (loading) {
    return (
      <div>
        <PageHeader title={t.medications.edit} />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={t.medications.edit} />
      <MedForm
        initialData={medication}
        onSuccess={() => router.push("/medications")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
