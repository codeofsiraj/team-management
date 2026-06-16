import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ToolUsageForm from "@/components/tools/ToolUsageForm";
import { updateToolUsage } from "@/app/tools/actions";

type EditToolPageProps = { params: Promise<{ id: string }> };

export default async function EditToolPage({ params }: EditToolPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const sessionUser = session.user as typeof session.user & { id?: string };
  const { id } = await params;
  const entry = await prisma.toolUsage.findUnique({ where: { id } });
  if (!entry) notFound();
  if (entry.userId !== sessionUser.id) redirect("/tools");
  return <DashboardLayout><div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><header><Link href="/tools" className="text-sm font-medium text-slate-500">Back to AI Tools</Link><h1 className="mt-3 text-2xl font-semibold text-slate-950">Edit Tool Usage</h1></header><ToolUsageForm action={updateToolUsage} submitLabel="Update Entry" entry={entry} /></div></DashboardLayout>;
}
