"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { createNotification } from "@/lib/notifications";

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function getSessionUser() {
  const session = await auth();
  const sessionUser = session?.user as
    | (NonNullable<typeof session>["user"] & {
        id?: string;
        role?: string;
      })
    | undefined;

  if (!sessionUser?.id) {
    redirect("/login");
  }

  return sessionUser as typeof sessionUser & { id: string };
}

function handleUpdateError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    throw new Error("Daily update not found.");
  }

  throw error;
}

export async function createDailyUpdate(formData: FormData) {
  const sessionUser = await getSessionUser();
  const date = getValue(formData, "date");
  const workedOn = getValue(formData, "workedOn");
  const completedTasks = getValue(formData, "completedTasks");
  const blockers = getValue(formData, "blockers");
  const tomorrowPlan = getValue(formData, "tomorrowPlan");

  if (!date || !workedOn) {
    throw new Error("Date and worked on are required.");
  }

  try {
    const update = await prisma.dailyUpdate.create({
      data: {
        userId: sessionUser.id,
        date: new Date(`${date}T00:00:00.000Z`),
        workedOn,
        completedTasks: completedTasks || null,
        blockers: blockers || null,
        tomorrowPlan: tomorrowPlan || null,
      },
      select: { id: true },
    });
    await logActivity({
      userId: sessionUser.id,
      action: "created",
      entityType: "daily_update",
      entityId: update.id,
      description: "Created daily update",
    });
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { name: true, teamId: true },
    });
    const recipients = await prisma.user.findMany({
      where: {
        OR: [
          { role: "admin" },
          { role: "manager", teamId: user?.teamId ?? "__no_team__" },
        ],
      },
      select: { id: true },
    });
    await Promise.all(
      recipients
        .filter((recipient) => recipient.id !== sessionUser.id)
        .map((recipient) =>
          createNotification({
            userId: recipient.id,
            title: "Daily update created",
            message: `${user?.name ?? "A user"} submitted a daily update.`,
            type: "DAILY_UPDATE_CREATED",
          })
        )
    );
  } catch (error) {
    handleUpdateError(error);
  }

  revalidatePath("/updates");
  redirect("/updates");
}

export async function updateDailyUpdate(formData: FormData) {
  const sessionUser = await getSessionUser();
  const id = getValue(formData, "id");
  const date = getValue(formData, "date");
  const workedOn = getValue(formData, "workedOn");
  const completedTasks = getValue(formData, "completedTasks");
  const blockers = getValue(formData, "blockers");
  const tomorrowPlan = getValue(formData, "tomorrowPlan");

  if (!id || !date || !workedOn) {
    throw new Error("Date and worked on are required.");
  }

  const existing = await prisma.dailyUpdate.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing) {
    throw new Error("Daily update not found.");
  }

  if (existing.userId !== sessionUser.id) {
    redirect("/updates");
  }

  try {
    await prisma.dailyUpdate.update({
      where: { id },
      data: {
        date: new Date(`${date}T00:00:00.000Z`),
        workedOn,
        completedTasks: completedTasks || null,
        blockers: blockers || null,
        tomorrowPlan: tomorrowPlan || null,
      },
    });
  } catch (error) {
    handleUpdateError(error);
  }

  revalidatePath("/updates");
  redirect("/updates");
}
