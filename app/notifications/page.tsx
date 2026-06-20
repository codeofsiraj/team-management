import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { markAllNotificationsRead, markNotificationRead } from "@/app/notifications/actions";
import { getVisibleNotificationWhere } from "@/lib/notifications";

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const sessionUser = session.user as typeof session.user & { id?: string; role?: string };
  if (!sessionUser.id) redirect("/login");
  if (sessionUser.role === "admin") redirect("/");
  const notifications = await prisma.notification.findMany({
    where: getVisibleNotificationWhere(sessionUser.id),
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-sm font-medium uppercase text-slate-500">Notifications</p><h1 className="mt-2 text-2xl font-semibold text-slate-950">Notifications</h1></div>
          <form action={markAllNotificationsRead}><button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white">Mark all as read</button></form>
        </header>
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {notifications.length === 0 ? <div className="p-8 text-center"><p className="text-sm font-medium text-slate-700">No notifications found.</p><p className="mt-1 text-sm text-slate-500">Notifications will appear here when there is activity.</p></div> : <div className="divide-y divide-slate-200">{notifications.map((notification) => <div key={notification.id} className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${notification.isRead ? "bg-white" : "bg-slate-50"}`}><div><div className="font-medium text-slate-950">{notification.title}</div><div className="mt-1 text-sm text-slate-600">{notification.message}</div><div className="mt-1 text-xs text-slate-400">{notification.type} · {notification.user.name} · {dateFormatter.format(notification.createdAt)}</div></div>{notification.isRead ? <span className="text-sm text-slate-400">Read</span> : <form action={async () => { "use server"; await markNotificationRead(notification.id); }}><button className="text-sm font-medium text-slate-700 hover:text-slate-950">Mark as read</button></form>}</div>)}</div>}
        </section>
      </div>
    </DashboardLayout>
  );
}
