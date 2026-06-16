"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function getSessionUser() {
  const session = await auth();
  const sessionUser = session?.user as
    | (NonNullable<typeof session>["user"] & { id?: string; role?: string })
    | undefined;
  if (!sessionUser?.id) redirect("/login");
  return sessionUser as typeof sessionUser & { id: string };
}

function handleResearchError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    throw new Error("Research document not found.");
  }
  throw error;
}

function validateFileUrl(fileUrl: string) {
  try {
    const url = new URL(fileUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Invalid protocol.");
    }
  } catch {
    throw new Error("Enter a valid file URL.");
  }
}

export async function createResearchDocument(formData: FormData) {
  const sessionUser = await getSessionUser();
  const title = getValue(formData, "title");
  const description = getValue(formData, "description");
  const category = getValue(formData, "category");
  const fileUrl = getValue(formData, "fileUrl");
  if (!title || !description || !category || !fileUrl) {
    throw new Error("Title, description, category, and file URL are required.");
  }
  validateFileUrl(fileUrl);
  try {
    const document = await prisma.researchDocument.create({
      data: { userId: sessionUser.id, title, description, category, fileUrl },
      select: { id: true },
    });
    await logActivity({ userId: sessionUser.id, action: "created", entityType: "research_document", entityId: document.id, description: `Created research document ${title}` });
  } catch (error) {
    handleResearchError(error);
  }
  revalidatePath("/research");
  redirect("/research");
}

export async function updateResearchDocument(formData: FormData) {
  const sessionUser = await getSessionUser();
  const id = getValue(formData, "id");
  const title = getValue(formData, "title");
  const description = getValue(formData, "description");
  const category = getValue(formData, "category");
  const fileUrl = getValue(formData, "fileUrl");
  if (!id || !title || !description || !category || !fileUrl) {
    throw new Error("Title, description, category, and file URL are required.");
  }
  validateFileUrl(fileUrl);
  const existing = await prisma.researchDocument.findUnique({ where: { id }, select: { userId: true } });
  if (!existing) throw new Error("Research document not found.");
  if (existing.userId !== sessionUser.id) redirect("/research");
  try {
    await prisma.researchDocument.update({ where: { id }, data: { title, description, category, fileUrl } });
  } catch (error) {
    handleResearchError(error);
  }
  revalidatePath("/research");
  redirect("/research");
}
