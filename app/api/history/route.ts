import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { kyivDayBoundsFromDateStr, formatKyivTime } from "@/lib/timezone";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const date = req.nextUrl.searchParams.get("date");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "50");

  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  try {
    const where: Record<string, unknown> = { userId };

    if (date) {
      // date is "YYYY-MM-DD" in Kyiv timezone from the client
      const { start, end } = kyivDayBoundsFromDateStr(date);
      where.scheduledAt = { gte: start, lte: end };
    }

    const items = await prisma.medicationHistory.findMany({
      where,
      include: {
        medication: { select: { name: true, color: true, dosage: true, unit: true } },
      },
      orderBy: { scheduledAt: "desc" },
      take: limit,
    });

    const formatted = items.map((item) => ({
      id: item.id,
      medicationId: item.medicationId,
      medicationName: item.medication.name,
      color: item.medication.color,
      dosage: item.medication.dosage,
      unit: item.medication.unit,
      scheduledAt: item.scheduledAt.toISOString(),
      takenAt: item.takenAt?.toISOString() ?? null,
      status: item.status,
      time: formatKyivTime(item.scheduledAt), // HH:mm in Kyiv timezone
    }));

    return NextResponse.json({ items: formatted, total: formatted.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
