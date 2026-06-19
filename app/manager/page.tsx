import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/dashboard/StatCard";
import DashboardLayout from "@/components/layout/DashboardLayout";

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatLabel(value: string) {
  return value.replace("_", " ");
}

export default async function ManagerDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sessionUser = session.user as typeof session.user & {
    id?: string;
    role?: string;
  };

  if (sessionUser.role === "member") {
    redirect("/member");
  }

  const manager = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      name: true,
      role: true,
      teamId: true,
      team: {
        select: {
          name: true,
          _count: {
            select: {
              members: true,
              tasks: true,
            },
          },
        },
      },
    },
  });

  if (!manager?.teamId || !manager.team) {
    return (
      <DashboardLayout>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <header className="brand-hero rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-normal text-slate-500">
              Digiart Creation
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Manager Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Welcome back, {session.user.name}
            </p>
          </header>
          <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-700">
              You are not assigned to a team yet.
            </p>
          </section>
        </div>
      </DashboardLayout>
    );
  }

  const [pendingTasks, inProgressTasks, completedTasks, recentTasks] =
    await Promise.all([
      prisma.task.count({
        where: {
          teamId: manager.teamId,
          status: "pending",
        },
      }),
      prisma.task.count({
        where: {
          teamId: manager.teamId,
          status: "in_progress",
        },
      }),
      prisma.task.count({
        where: {
          teamId: manager.teamId,
          status: "completed",
        },
      }),
      prisma.task.findMany({
        where: {
          teamId: manager.teamId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          assignedTo: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="brand-hero flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-normal text-slate-500">
              Digiart Creation
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Manager Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Welcome back, {manager.name}
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
              Role
            </p>
            <p className="mt-1 text-sm font-semibold capitalize text-slate-950">
              {manager.role}
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Assigned Team"
            value={1}
            description={manager.team.name}
          />
          <StatCard
            label="Team Members"
            value={manager.team._count.members}
            description="Employees in your team"
          />
          <StatCard
            label="Team Tasks"
            value={manager.team._count.tasks}
            description="Tasks linked to your team"
          />
          <StatCard
            label="Pending"
            value={pendingTasks}
            description="Team tasks waiting"
          />
          <StatCard
            label="In Progress"
            value={inProgressTasks}
            description={`${completedTasks} completed`}
          />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-950">
              Recent Team Tasks
            </h2>
            <Link
              href="/tasks"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              View all
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <p className="mt-6 rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No tasks found for your team.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-normal text-slate-500">
                  <tr>
                    <th className="py-3 pr-4 font-semibold">Title</th>
                    <th className="py-3 pr-4 font-semibold">Assigned To</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 pr-4 font-semibold">Priority</th>
                    <th className="py-3 pr-4 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="py-3 pr-4 font-medium text-slate-950">
                        {task.title}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {task.assignedTo?.name ?? "Unassigned"}
                      </td>
                      <td className="py-3 pr-4 capitalize text-slate-600">
                        {formatLabel(task.status)}
                      </td>
                      <td className="py-3 pr-4 capitalize text-slate-600">
                        {task.priority}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {dateFormatter.format(task.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
