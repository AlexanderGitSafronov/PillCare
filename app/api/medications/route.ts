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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, dosage, unit, color, notes, stock, schedule } = body;

    if (!userId || !name || !dosage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const medication = await prisma.medication.create({
      data: {
        userId,
        name,
        dosage: String(dosage),
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
