"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { createNotification } from "@/lib/notifications";

const scheduledStartTime = "09:00";
const scheduledEndTime = "18:00";

function startOfToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function minutesFromTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesFromDate(value: Date) {
  return value.getHours() * 60 + value.getMinutes();
}

async function getSessionUser() {
  const session = await auth();
  const sessionUser = session?.user as
    | (NonNullable<typeof session>["user"] & { id?: string; role?: string })
    | undefined;

  if (!sessionUser?.id) redirect("/login");
  return sessionUser as typeof sessionUser & { id: string };
}

function handleAttendanceError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new Error("Attendance is already recorded for today.");
  }

  throw error;
}

async function notifyAdmins(message: string) {
  const admins = await prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true },
  });

  await Promise.all(
    admins.map((admin) =>
      createNotification({
        userId: admin.id,
        title: "Attendance update",
        message,
        type: "ATTENDANCE_UPDATED",
      })
    )
  );
}

export async function checkIn() {
  const sessionUser = await getSessionUser();
  const now = new Date();
  const date = startOfToday();
  const lateDurationMinutes = Math.max(
    0,
    minutesFromDate(now) - minutesFromTime(scheduledStartTime)
  );

  try {
    const attendance = await prisma.attendanceRecord.create({
      data: {
        userId: sessionUser.id,
        date,
        scheduledStartTime,
        scheduledEndTime,
        actualCheckInTime: now,
        status: lateDurationMinutes > 0 ? "Late" : "Present",
        lateDurationMinutes: lateDurationMinutes || null,
      },
      select: { id: true },
    });
    await logActivity({
      userId: sessionUser.id,
      action: "created",
      entityType: "attendance",
      entityId: attendance.id,
      description: "Recorded attendance check-in",
    });
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { name: true },
    });
    await notifyAdmins(
      `New attendance check-in recorded for ${user?.name ?? "a team member"}.`
    );
  } catch (error) {
    handleAttendanceError(error);
  }

  revalidatePath("/attendance");
}

export async function checkOut() {
  const sessionUser = await getSessionUser();
  const now = new Date();
  const date = startOfToday();
  const earlyDepartureMinutes = Math.max(
    0,
    minutesFromTime(scheduledEndTime) - minutesFromDate(now)
  );

  const existing = await prisma.attendanceRecord.findUnique({
    where: { userId_date: { userId: sessionUser.id, date } },
    select: { id: true, actualCheckOutTime: true },
  });

  if (!existing) {
    throw new Error("Check in before recording check-out.");
  }

  if (existing.actualCheckOutTime) {
    throw new Error("Check-out is already recorded for today.");
  }

  const attendance = await prisma.attendanceRecord.update({
    where: { id: existing.id },
    data: {
      actualCheckOutTime: now,
      earlyDepartureMinutes: earlyDepartureMinutes || null,
    },
    select: { id: true },
  });
  await logActivity({
    userId: sessionUser.id,
    action: "updated",
    entityType: "attendance",
    entityId: attendance.id,
    description: "Recorded attendance check-out",
  });
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { name: true },
  });
  await notifyAdmins(
    `Attendance check-out recorded for ${user?.name ?? "a team member"}.`
  );

  revalidatePath("/attendance");
}
