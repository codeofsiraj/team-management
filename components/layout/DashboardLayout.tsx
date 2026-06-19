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
    <div className="min-h-screen bg-[#F8F7FB] text-[#1F2937] lg:flex">
      <Sidebar
        role={sessionUser?.role}
        unreadNotifications={unreadNotifications}
      />
      <main className="flex-1">
        {announcements.length > 0 ? (
          <div className="border-b border-[#E5E7EB] bg-gradient-to-r from-[#770FC2]/10 via-white to-[#A05DD0]/10 px-4 py-3 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="rounded-md border border-[#A05DD0]/25 bg-white/80 px-4 py-3 shadow-sm backdrop-blur"
                >
                  <p className="text-sm font-semibold text-[#1F2937]">
                    {announcement.title}
                  </p>
                  <p className="mt-1 text-sm text-[#6B7280]">
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
