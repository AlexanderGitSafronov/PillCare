import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startOfDay, endOfDay, parseISO, eachDayOfInterval, format } from "date-fns";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");

  if (!userId || !from || !to) {
    return NextResponse.json({ error: "userId, from, to required" }, { status: 400 });
  }

  try {
    const fromDate = parseISO(from);
    const toDate = parseISO(to);

    const history = await prisma.medicationHistory.findMany({
      where: {
        userId,
        scheduledAt: {
          gte: startOfDay(fromDate),
          lte: endOfDay(toDate),
        },
      },
      select: { scheduledAt: true, status: true },
    });

    const days = eachDayOfInterval({ start: fromDate, end: toDate });
    const stats = days.map((day) => {
      const key = format(day, "yyyy-MM-dd");
      const dayItems = history.filter(
        (h) => format(h.scheduledAt, "yyyy-MM-dd") === key
      );
      return {
        date: key,
        taken: dayItems.filter((h) => h.status === "TAKEN").length,
        missed: dayItems.filter((h) => h.status === "MISSED").length,
        pending: dayItems.filter((h) => h.status === "PENDING").length,
        total: dayItems.length,
      };
    });

    return NextResponse.json(stats);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
