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

export async function createBroadcastNotification(formData: FormData) {
  const sessionUser = await getSessionUser();

  if (sessionUser.role !== "admin") {
    redirect("/");
  }

  const title = String(formData.get("title") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const audience = String(formData.get("audience") ?? "");
  const expiresAtValue = String(formData.get("expiresAt") ?? "").trim();
  const important = formData.get("important") === "on";

  if (!title || !message || !["employees", "managers", "everyone"].includes(audience)) {
    throw new Error("Enter a title, message, and valid audience.");
  }

  const users = await prisma.user.findMany({
    where:
      audience === "employees"
        ? { role: "member" }
        : audience === "managers"
          ? { role: "manager" }
          : {},
    select: { id: true },
  });

  if (users.length > 0) {
    await prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        title,
        message,
        type: "ANNOUNCEMENT",
        important,
        expiresAt: expiresAtValue ? new Date(`${expiresAtValue}T23:59:59.999Z`) : null,
      })),
    });
  }

  revalidatePath("/");
  revalidatePath("/manager");
  revalidatePath("/member");
}
