"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ModuleKey } from "@/lib/moduleAlerts";

export async function markModuleReviewed(module: ModuleKey) {
  const session = await auth();
  const sessionUser = session?.user as
    | (NonNullable<typeof session>["user"] & { id?: string; role?: string })
    | undefined;

  if (!sessionUser?.id || (sessionUser.role !== "admin" && sessionUser.role !== "manager")) {
    return;
  }

  await prisma.moduleReview.upsert({
    where: {
      userId_module: {
        userId: sessionUser.id,
        module,
      },
    },
    update: { reviewedAt: new Date() },
    create: {
      userId: sessionUser.id,
      module,
    },
  });

  revalidatePath("/");
}
