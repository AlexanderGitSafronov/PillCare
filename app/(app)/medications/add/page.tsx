"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { MedForm } from "@/components/medications/MedForm";
import { useI18n } from "@/lib/i18n";

export default function AddMedicationPage() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <div>
      <PageHeader title={t.medications.add} />
      <MedForm
        onSuccess={() => router.push("/medications")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
