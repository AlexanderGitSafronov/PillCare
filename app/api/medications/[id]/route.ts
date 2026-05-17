import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const userId = await getSessionUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const medication = await prisma.medication.findUnique({
      where: { id },
      include: { schedules: { where: { isActive: true } } },
    });
    if (!medication) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (medication.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json(medication);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const userId = await getSessionUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { name, dosage, unit, color, notes, stock, schedule } = body;

    const safeName = typeof name === "string"
      ? name.trim().replace(/<[^>]*>/g, "").trim()
      : undefined;
    const safeNotes = typeof notes === "string"
      ? notes.trim().replace(/<[^>]*>/g, "").slice(0, 500) || null
      : null;
    const dosageNum = parseFloat(String(dosage));

    if (!safeName || safeName.length < 1 || safeName.length > 100) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    if (isNaN(dosageNum) || dosageNum <= 0 || dosageNum > 99999) {
      return NextResponse.json({ error: "Invalid dosage" }, { status: 400 });
    }

    // Check ownership
    const existing = await prisma.medication.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const medication = await prisma.medication.update({
      where: { id },
      data: {
        name: safeName,
        dosage: String(dosageNum),
        unit,
        color,
        notes: safeNotes,
        stock: stock ?? null,
      },
    });

    if (schedule) {
      await prisma.schedule.deleteMany({ where: { medicationId: id } });
      await prisma.schedule.create({
        data: {
          medicationId: id,
          frequency: schedule.frequency,
          times: schedule.times,
          weekdays: schedule.weekdays ?? [],
        },
      });
    }

    return NextResponse.json(medication);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const userId = await getSessionUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    // Check ownership
    const existing = await prisma.medication.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.medication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
