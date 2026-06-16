import { prisma } from "@/lib/prisma";

type ActivityInput = {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
};

export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
  description,
}: ActivityInput) {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      description,
    },
  });
}
