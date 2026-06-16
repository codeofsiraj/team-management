import { ReactNode } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/layout/Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth();
  const sessionUser = session?.user as
    | (NonNullable<typeof session>["user"] & {
        id?: string;
        role?: string;
      })
    | undefined;
  const unreadNotifications = sessionUser?.id
    ? await prisma.notification.count({
        where:
          sessionUser.role === "admin"
            ? { isRead: false }
            : { userId: sessionUser.id, isRead: false },
      })
    : 0;
  const announcements = await prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:flex">
      <Sidebar
        role={sessionUser?.role}
        unreadNotifications={unreadNotifications}
      />
      <main className="flex-1">
        {announcements.length > 0 ? (
          <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-slate-950">
                    {announcement.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {announcement.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
