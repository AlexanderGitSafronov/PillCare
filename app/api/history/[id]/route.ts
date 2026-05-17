import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

const ALLOWED_STATUSES = ["TAKEN", "SKIPPED", "MISSED", "PENDING"] as const;

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { status, takenAt } = body;

    // Validate status
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate takenAt if provided
    if (takenAt !== undefined && takenAt !== null) {
      const parsed = new Date(takenAt);
      if (isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "takenAt must be a valid ISO date string" }, { status: 400 });
      }
    }

    const updated = await prisma.medicationHistory.update({
      where: { id },
      data: {
        status,
        takenAt: takenAt ? new Date(takenAt) : status === "TAKEN" ? new Date() : null,
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function POST(_: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const updated = await prisma.medicationHistory.update({
      where: { id },
      data: { status: "TAKEN", takenAt: new Date() },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
