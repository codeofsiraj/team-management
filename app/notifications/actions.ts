"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getVisibleNotificationWhere } from "@/lib/notifications";

async function getSessionUser() {
  const session = await auth();
  const sessionUser = session?.user as
    | (NonNullable<typeof session>["user"] & { id?: string; role?: string })
    | undefined;

  if (!sessionUser?.id) {
    redirect("/login");
  }

  return sessionUser as typeof sessionUser & { id: string };
}

export async function markNotificationRead(id: string) {
  const sessionUser = await getSessionUser();
  const notification = await prisma.notification.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!notification) {
    throw new Error("Notification not found.");
  }

  if (sessionUser.role !== "admin" && notification.userId !== sessionUser.id) {
    redirect("/notifications");
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  revalidatePath("/notifications");
}

export async function markAllNotificationsRead() {
  const sessionUser = await getSessionUser();
  await prisma.notification.updateMany({
    where:
      sessionUser.role === "admin"
        ? { id: "__admin_notifications_disabled__" }
        : getVisibleNotificationWhere(sessionUser.id),
    data: { isRead: true },
  });

  revalidatePath("/notifications");
}
