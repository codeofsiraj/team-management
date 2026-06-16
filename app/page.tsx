import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/dashboard/StatCard";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [
    totalUsers,
    totalTeams,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.team.count(),
    prisma.task.count(),
    prisma.task.count({
      where: {
        status: "pending",
      },
    }),
    prisma.task.count({
      where: {
        status: "in_progress",
      },
    }),
    prisma.task.count({
      where: {
        status: "completed",
      },
    }),
  ]);

  const sessionUser = session.user as typeof session.user & {
    role?: string;
  };

  if (sessionUser.role === "manager") {
    redirect("/manager");
  }

  if (sessionUser.role === "member") {
    redirect("/member");
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-normal text-slate-500">
              Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Welcome back, {session.user.name}
            </h1>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
              Role
            </p>
            <p className="mt-1 text-sm font-semibold capitalize text-slate-950">
              {sessionUser.role}
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Total Users"
            value={totalUsers}
            description="Registered employees and admins"
          />
          <StatCard
            label="Total Teams"
            value={totalTeams}
            description="Active team records"
          />
          <StatCard
            label="Total Tasks"
            value={totalTasks}
            description="All tracked work items"
          />
          <StatCard
            label="Pending Tasks"
            value={pendingTasks}
            description="Tasks waiting for action"
          />
          <StatCard
            label="In Progress Tasks"
            value={inProgressTasks}
            description="Tasks currently being worked on"
          />
          <StatCard
            label="Completed Tasks"
            value={completedTasks}
            description="Tasks finished by the team"
          />
        </section>
      </div>
    </DashboardLayout>
  );
}
