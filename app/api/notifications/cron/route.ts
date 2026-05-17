import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Called by Vercel Cron every minute.
// Sends push notifications for medications due in the past 2 minutes
// that haven't been notified yet.
export async function GET(req: NextRequest) {
  // Accept auth via header (Vercel Cron) or query param (external cron services)
  const authHeader = req.headers.get("authorization");
  const querySecret = req.nextUrl.searchParams.get("secret");
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const headerOk = authHeader === `Bearer ${secret}`;
    const queryOk = querySecret === secret;
    if (!headerOk && !queryOk) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidEmail = process.env.VAPID_EMAIL ?? "mailto:admin@pillcare.app";

  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json({ error: "VAPID keys not configured" }, { status: 500 });
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - 2 * 60 * 1000); // 2 min ago

  try {
    const due = await prisma.medicationHistory.findMany({
      where: {
        status: "PENDING",
        scheduledAt: { gte: windowStart, lte: now },
        notifiedAt: null,
      },
      include: {
        user: { select: { id: true, pushSubscription: true, notificationsEnabled: true } },
        medication: { select: { name: true, dosage: true, unit: true } },
      },
    });

    if (due.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    const webpush = await import("web-push");
    webpush.default.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

    let sent = 0;
    const notifiedIds: string[] = [];

    for (const entry of due) {
      if (!entry.user.notificationsEnabled || !entry.user.pushSubscription) {
        notifiedIds.push(entry.id);
        continue;
      }

      try {
        const subscription = JSON.parse(entry.user.pushSubscription);
        const { name, dosage, unit } = entry.medication;
        await webpush.default.sendNotification(
          subscription,
          JSON.stringify({
            title: "💊 Час прийняти ліки",
            body: `${name} — ${dosage} ${unit}`,
            primaryKey: entry.id,
            url: "/dashboard",
          })
        );
        sent++;
      } catch (e) {
        console.error(`Push failed for history ${entry.id}:`, e);
      }

      notifiedIds.push(entry.id);
    }

    if (notifiedIds.length > 0) {
      await prisma.medicationHistory.updateMany({
        where: { id: { in: notifiedIds } },
        data: { notifiedAt: now },
      });
    }

    return NextResponse.json({ sent, total: due.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
