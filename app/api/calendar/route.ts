import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseISO, eachDayOfInterval, format } from "date-fns";
import { kyivDayBoundsFromDateStr, getKyivDateStr } from "@/lib/timezone";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");

  if (!userId || !from || !to) {
    return NextResponse.json({ error: "userId, from, to required" }, { status: 400 });
  }

  try {
    // from/to are Kyiv date strings "YYYY-MM-DD" from the client
    const { start: rangeStart } = kyivDayBoundsFromDateStr(from);
    const { end: rangeEnd } = kyivDayBoundsFromDateStr(to);

    const history = await prisma.medicationHistory.findMany({
      where: {
        userId,
        scheduledAt: { gte: rangeStart, lte: rangeEnd },
      },
      select: { scheduledAt: true, status: true },
    });

    // Iterate over Kyiv calendar days in the range
    const days = eachDayOfInterval({ start: parseISO(from), end: parseISO(to) });
    const stats = days.map((day) => {
      const key = format(day, "yyyy-MM-dd"); // Kyiv date string
      const dayItems = history.filter(
        (h) => getKyivDateStr(h.scheduledAt) === key
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
