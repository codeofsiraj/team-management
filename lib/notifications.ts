import { prisma } from "@/lib/prisma";

type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_COMPLETED"
  | "DAILY_UPDATE_CREATED"
  | "ANNOUNCEMENT";

type NotificationInput = {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
};

export async function createNotification({
  userId,
  title,
  message,
  type,
}: NotificationInput) {
  await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });
}

export async function createAnnouncementNotifications(
  title: string,
  message: string
) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  if (users.length === 0) {
    return;
  }

  await prisma.notification.createMany({
    data: users.map((user) => ({
      userId: user.id,
      title,
      message,
      type: "ANNOUNCEMENT",
    })),
  });
}
