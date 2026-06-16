"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createAnnouncementNotifications } from "@/lib/notifications";

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function requireAdmin() {
  const session = await auth();
  const sessionUser = session?.user as
    | (NonNullable<typeof session>["user"] & { id?: string; role?: string })
    | undefined;
  if (sessionUser?.role !== "admin" || !sessionUser.id) redirect("/announcements");
  return sessionUser as typeof sessionUser & { id: string };
}

function handleAnnouncementError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    throw new Error("Announcement not found.");
  }

  throw error;
}

export async function createAnnouncement(formData: FormData) {
  const sessionUser = await requireAdmin();
  const title = getValue(formData, "title");
  const message = getValue(formData, "message");
  const isActive = formData.get("isActive") === "on";
  if (!title || !message) throw new Error("Title and message are required.");
  try {
    await prisma.announcement.create({
      data: { title, message, isActive, createdById: sessionUser.id },
      select: { id: true },
    });
    if (isActive) await createAnnouncementNotifications(title, message);
  } catch (error) {
    handleAnnouncementError(error);
  }
  revalidatePath("/announcements");
  revalidatePath("/");
  redirect("/announcements");
}

export async function updateAnnouncement(formData: FormData) {
  await requireAdmin();
  const id = getValue(formData, "id");
  const title = getValue(formData, "title");
  const message = getValue(formData, "message");
  const isActive = formData.get("isActive") === "on";

  if (!id || !title || !message) {
    throw new Error("Title and message are required.");
  }

  try {
    await prisma.announcement.update({
      where: { id },
      data: { title, message, isActive },
    });
  } catch (error) {
    handleAnnouncementError(error);
  }

  revalidatePath("/announcements");
  revalidatePath("/");
  redirect("/announcements");
}

export async function toggleAnnouncementActive(id: string, isActive: boolean) {
  await requireAdmin();
  try {
    const announcement = await prisma.announcement.update({
      where: { id },
      data: { isActive },
      select: { title: true, message: true },
    });
    if (isActive) await createAnnouncementNotifications(announcement.title, announcement.message);
  } catch (error) {
    handleAnnouncementError(error);
  }
  revalidatePath("/announcements");
  revalidatePath("/");
}
