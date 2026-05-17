import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title, message, historyId } = body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.pushSubscription) {
      return NextResponse.json({ error: "No push subscription" }, { status: 400 });
    }

    const webpush = await import("web-push");
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidEmail = process.env.VAPID_EMAIL ?? "mailto:admin@pillcare.app";

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json({ error: "VAPID keys not configured" }, { status: 500 });
    }

    webpush.default.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

    const subscription = JSON.parse(user.pushSubscription);
    await webpush.default.sendNotification(
      subscription,
      JSON.stringify({
        title,
        body: message,
        primaryKey: historyId,
        url: "/dashboard",
      })
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
