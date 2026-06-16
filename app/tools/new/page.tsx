import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ToolUsageForm from "@/components/tools/ToolUsageForm";
import { createToolUsage } from "@/app/tools/actions";

export default async function NewToolPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <DashboardLayout><div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><header><Link href="/tools" className="text-sm font-medium text-slate-500">Back to AI Tools</Link><h1 className="mt-3 text-2xl font-semibold text-slate-950">Add Tool Usage</h1></header><ToolUsageForm action={createToolUsage} submitLabel="Create Entry" /></div></DashboardLayout>;
}
