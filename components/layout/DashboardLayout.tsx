import { ReactNode } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/layout/Sidebar";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";
import { getVisibleNotificationWhere } from "@/lib/notifications";

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
    ? sessionUser.role === "admin"
      ? 0
      : await prisma.notification.count({
        where: getVisibleNotificationWhere(sessionUser.id, {
          isRead: false,
        }),
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
        <AnnouncementBanner
          announcements={announcements}
          userId={sessionUser?.id}
        />
        {children}
      </main>
    </div>
  );
}
