import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    // Get today's history
    const todayHistory = await prisma.medicationHistory.findMany({
      where: {
        userId,
        scheduledAt: { gte: todayStart, lte: todayEnd },
      },
      include: {
        medication: {
          select: { name: true, dosage: true, unit: true, color: true, icon: true },
        },
      },
      orderBy: { scheduledAt: "asc" },
    });

    // If no history for today, generate from schedules
    if (todayHistory.length === 0) {
      const medications = await prisma.medication.findMany({
        where: { userId, isActive: true },
        include: { schedules: { where: { isActive: true } } },
      });

      const toCreate = [];
      for (const med of medications) {
        for (const sched of med.schedules) {
          const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
          const shouldRun =
            sched.frequency === "DAILY" ||
            sched.frequency === "TWICE_DAILY" ||
            sched.frequency === "THREE_TIMES_DAILY" ||
            (sched.frequency === "WEEKLY" && sched.weekdays.includes(dayOfWeek)) ||
            (sched.frequency === "CUSTOM" && (sched.weekdays.length === 0 || sched.weekdays.includes(dayOfWeek)));

          if (shouldRun) {
            for (const time of sched.times) {
              const [h, m] = time.split(":").map(Number);
              const scheduledAt = new Date(todayStart);
              scheduledAt.setHours(h, m, 0, 0);
              const isPast = scheduledAt < now;
              toCreate.push({
                userId,
                medicationId: med.id,
                scheduledAt,
                status: isPast ? ("MISSED" as const) : ("PENDING" as const),
              });
            }
          }
        }
      }

      if (toCreate.length > 0) {
        await prisma.medicationHistory.createMany({ data: toCreate, skipDuplicates: true });
        // Refetch
        return GET(req);
      }
    } else {
      // Update past PENDING to MISSED
      const toMiss = todayHistory
        .filter((h) => h.status === "PENDING" && h.scheduledAt < now)
        .map((h) => h.id);

      if (toMiss.length > 0) {
        await prisma.medicationHistory.updateMany({
          where: { id: { in: toMiss } },
          data: { status: "MISSED" },
        });
        return GET(req);
      }
    }

    const taken = todayHistory.filter((h) => h.status === "TAKEN").length;
    const missed = todayHistory.filter((h) => h.status === "MISSED").length;
    const pending = todayHistory.filter((h) => h.status === "PENDING").length;

    // Calculate streak
    let streak = 0;
    const checkDate = new Date(todayStart);
    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      const dayHistory = await prisma.medicationHistory.findMany({
        where: {
          userId,
          scheduledAt: { gte: startOfDay(checkDate), lte: endOfDay(checkDate) },
        },
      });
      if (dayHistory.length === 0) break;
      const allTaken = dayHistory.every((h) => h.status === "TAKEN" || h.status === "SKIPPED");
      if (!allTaken) break;
      streak++;
      if (streak > 365) break;
    }

    const todayMeds = todayHistory.map((h) => ({
      historyId: h.id,
      medicationId: h.medicationId,
      name: h.medication.name,
      dosage: h.medication.dosage,
      unit: h.medication.unit,
      color: h.medication.color,
      scheduledAt: h.scheduledAt.toISOString(),
      status: h.status,
    }));

    return NextResponse.json({
      todayMeds,
      takenCount: taken,
      missedCount: missed,
      pendingCount: pending,
      totalCount: todayHistory.length,
      streak,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
