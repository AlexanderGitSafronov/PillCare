import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  try {
    const medications = await prisma.medication.findMany({
      where: { userId },
      include: { schedules: { where: { isActive: true } } },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(medications);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch medications" }, { status: 500 });
  }
}

const ALLOWED_UNITS = [
  "мг", "г", "мл", "краплі", "таблетки", "капсули", "МО", "мкг",
  "mg", "g", "ml", "drops", "tablets", "capsules", "IU", "mcg",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, dosage, unit, color, notes, stock, schedule } = body;

    if (!userId || !name || !dosage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate and sanitize name (strip HTML tags)
    const trimmedName = typeof name === "string"
      ? name.trim().replace(/<[^>]*>/g, "").trim()
      : "";
    if (!trimmedName || trimmedName.length < 1) {
      return NextResponse.json({ error: "Name must be at least 1 character" }, { status: 400 });
    }
    if (trimmedName.length > 100) {
      return NextResponse.json({ error: "Name must not exceed 100 characters" }, { status: 400 });
    }

    // Validate dosage
    const dosageNum = parseFloat(String(dosage));
    if (isNaN(dosageNum) || dosageNum <= 0) {
      return NextResponse.json({ error: "Dosage must be a positive number" }, { status: 400 });
    }
    if (dosageNum > 99999) {
      return NextResponse.json({ error: "Dosage must not exceed 99999" }, { status: 400 });
    }

    // Validate notes
    if (notes !== undefined && notes !== null) {
      if (typeof notes !== "string" || notes.length > 500) {
        return NextResponse.json({ error: "Notes must not exceed 500 characters" }, { status: 400 });
      }
    }

    // Validate color
    if (color !== undefined && color !== null) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(String(color))) {
        return NextResponse.json({ error: "Color must be a valid hex color (e.g. #4F8EF7)" }, { status: 400 });
      }
    }

    // Validate unit
    if (unit !== undefined && unit !== null) {
      if (!ALLOWED_UNITS.includes(String(unit))) {
        return NextResponse.json(
          { error: `Unit must be one of: ${ALLOWED_UNITS.join(", ")}` },
          { status: 400 }
        );
      }
    }

    const medication = await prisma.medication.create({
      data: {
        userId,
        name: trimmedName,
        dosage: String(dosageNum),
        unit: unit ?? "мг",
        color: color ?? "#4F8EF7",
        notes: notes ?? null,
        stock: stock ?? null,
        schedules: schedule
          ? {
              create: {
                frequency: schedule.frequency ?? "DAILY",
                times: schedule.times ?? ["08:00"],
                weekdays: schedule.weekdays ?? [],
              },
            }
          : undefined,
      },
      include: { schedules: true },
    });

    // Create initial history entries for today
    if (schedule?.times?.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const historyEntries = schedule.times.map((time: string) => {
        const [h, m] = time.split(":").map(Number);
        const scheduledAt = new Date(today);
        scheduledAt.setHours(h, m, 0, 0);
        return { userId, medicationId: medication.id, scheduledAt, status: "PENDING" as const };
      });
      await prisma.medicationHistory.createMany({ data: historyEntries });
    }

    return NextResponse.json(medication, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create medication" }, { status: 500 });
  }
}
