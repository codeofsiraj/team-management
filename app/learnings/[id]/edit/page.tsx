import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LearningForm from "@/components/learnings/LearningForm";
import { updateLearning } from "@/app/learnings/actions";

type EditLearningPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditLearningPage({
  params,
}: EditLearningPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sessionUser = session.user as typeof session.user & { id?: string };
  const { id } = await params;
  const learning = await prisma.learning.findUnique({ where: { id } });

  if (!learning) {
    notFound();
  }

  if (learning.userId !== sessionUser.id) {
    redirect("/learnings");
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header>
          <Link href="/learnings" className="text-sm font-medium text-slate-500">
            Back to Learnings
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">
            Edit Learning
          </h1>
        </header>
        <LearningForm
          action={updateLearning}
          submitLabel="Update Learning"
          learning={learning}
        />
      </div>
    </DashboardLayout>
  );
}
