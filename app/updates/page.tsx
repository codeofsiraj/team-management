import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PaginationControls from "@/components/layout/PaginationControls";
import { getPage, getPagination, PAGE_SIZE } from "@/lib/pagination";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  day: "numeric",
  month: "short",
});

type UpdatesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function UpdatesPage({ searchParams }: UpdatesPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sessionUser = session.user as typeof session.user & {
    id?: string;
    role?: string;
  };

  const currentUser =
    sessionUser.role === "manager"
      ? await prisma.user.findUnique({
          where: { id: sessionUser.id },
          select: { teamId: true },
        })
      : null;

  const params = await searchParams;
  const page = getPage(params.page);
  const showEmployeeColumn = sessionUser.role === "admin";
  const where =
    sessionUser.role === "admin"
      ? {}
      : sessionUser.role === "manager"
        ? { user: { teamId: currentUser?.teamId ?? "__no_team__" } }
        : { userId: sessionUser.id };
  const [updates, totalUpdates] = await Promise.all([
    prisma.dailyUpdate.findMany({
      where,
      ...getPagination(page),
      orderBy: { date: "desc" },
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
    }),
    prisma.dailyUpdate.count({ where }),
  ]);

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-normal text-slate-500">
              Daily Updates
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Status Updates
            </h1>
          </div>
          {sessionUser.role !== "admin" ? (
            <Link
              href="/updates/new"
              className="inline-flex items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
            >
              Add Update
            </Link>
          ) : null}
        </header>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {updates.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                No daily updates found.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Updates will appear here after they are submitted.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-normal text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    {showEmployeeColumn ? (
                      <th className="px-4 py-3 font-semibold">Employee</th>
                    ) : null}
                    <th className="px-4 py-3 font-semibold">Worked On</th>
                    <th className="px-4 py-3 font-semibold">Blockers</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {updates.map((update) => (
                    <tr key={update.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-slate-600">
                        {dateFormatter.format(update.date)}
                      </td>
                      {showEmployeeColumn ? (
                        <td className="px-4 py-4 font-medium text-slate-950">
                          {update.user.name}
                        </td>
                      ) : null}
                      <td className="px-4 py-4 text-slate-600">
                        {update.workedOn}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {update.blockers || "None"}
                      </td>
                      <td className="px-4 py-4">
                        {update.user.id === sessionUser.id ? (
                          <div className="flex flex-col gap-1">
                            <Link
                              href={`/updates/${update.id}/edit`}
                              className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
                            >
                              Edit
                            </Link>
                            {update.updatedAt.getTime() !== update.createdAt.getTime() ? (
                              <span className="text-xs text-slate-500">
                                (Edited on {dateFormatter.format(update.updatedAt)})
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            View only
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <PaginationControls
          page={page}
          total={totalUpdates}
          pageSize={PAGE_SIZE}
          basePath="/updates"
          searchParams={params}
        />
      </div>
    </DashboardLayout>
  );
}
