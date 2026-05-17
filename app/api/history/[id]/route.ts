import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { status, takenAt } = body;

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
