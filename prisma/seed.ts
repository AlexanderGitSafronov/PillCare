import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean up existing demo user (different ID from previous seed)
  await prisma.user.deleteMany({ where: { email: "demo@pillcare.app" } });

  const hashedPassword = await bcrypt.hash("demo123", 10);

  const user = await prisma.user.create({
    data: {
      id: "demo-user-001",
      email: "demo@pillcare.app",
      name: "Демо Користувач",
      password: hashedPassword,
      language: "uk",
      theme: "system",
      notificationsEnabled: true,
    },
  });

  const med1 = await prisma.medication.create({
    data: {
      userId: user.id,
      name: "Вітамін D3",
      dosage: "1000",
      unit: "МО",
      color: "#FF9500",
      icon: "sun",
      notes: "Приймати під час їжі",
      schedules: {
        create: {
          frequency: "DAILY",
          times: ["08:00"],
        },
      },
    },
  });

  const med2 = await prisma.medication.create({
    data: {
      userId: user.id,
      name: "Магній",
      dosage: "400",
      unit: "мг",
      color: "#34C759",
      icon: "leaf",
      schedules: {
        create: {
          frequency: "DAILY",
          times: ["20:00"],
        },
      },
    },
  });

  const med3 = await prisma.medication.create({
    data: {
      userId: user.id,
      name: "Омега-3",
      dosage: "1000",
      unit: "мг",
      color: "#4F8EF7",
      icon: "droplets",
      schedules: {
        create: {
          frequency: "TWICE_DAILY",
          times: ["08:00", "20:00"],
        },
      },
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.medicationHistory.createMany({
    data: [
      {
        userId: user.id,
        medicationId: med1.id,
        scheduledAt: new Date(today.getTime() + 8 * 60 * 60 * 1000),
        takenAt: new Date(today.getTime() + 8 * 10 * 60 * 1000),
        status: "TAKEN",
      },
      {
        userId: user.id,
        medicationId: med3.id,
        scheduledAt: new Date(today.getTime() + 8 * 60 * 60 * 1000),
        status: "PENDING",
      },
      {
        userId: user.id,
        medicationId: med2.id,
        scheduledAt: new Date(today.getTime() + 20 * 60 * 60 * 1000),
        status: "PENDING",
      },
      {
        userId: user.id,
        medicationId: med3.id,
        scheduledAt: new Date(today.getTime() + 20 * 60 * 60 * 1000),
        status: "PENDING",
      },
    ],
  });

  console.log("Seed completed:", { user: user.email, medications: [med1.name, med2.name, med3.name] });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
