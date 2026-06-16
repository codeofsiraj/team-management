import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DailyUpdateForm from "@/components/updates/DailyUpdateForm";
import { createDailyUpdate } from "@/app/updates/actions";

export default async function NewUpdatePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header>
          <Link href="/updates" className="text-sm font-medium text-slate-500">
            Back to Updates
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">
            Add Daily Update
          </h1>
        </header>
        <DailyUpdateForm
          action={createDailyUpdate}
          submitLabel="Create Update"
        />
      </div>
    </DashboardLayout>
  );
}
