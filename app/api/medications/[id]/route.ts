import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const medication = await prisma.medication.findUnique({
      where: { id },
      include: { schedules: { where: { isActive: true } } },
    });
    if (!medication) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(medication);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { name, dosage, unit, color, notes, stock, schedule } = body;

    const medication = await prisma.medication.update({
      where: { id },
      data: {
        name,
        dosage: String(dosage),
        unit,
        color,
        notes: notes ?? null,
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

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.medication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
