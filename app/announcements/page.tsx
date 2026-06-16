import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { createAnnouncement, toggleAnnouncementActive } from "@/app/announcements/actions";

export default async function AnnouncementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const sessionUser = session.user as typeof session.user & { role?: string };
  const isAdmin = sessionUser.role === "admin";
  const announcements = await prisma.announcement.findMany({
    where: isAdmin ? {} : { isActive: true },
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header><p className="text-sm font-medium uppercase text-slate-500">Announcements</p><h1 className="mt-2 text-2xl font-semibold text-slate-950">Announcements</h1></header>
        {isAdmin ? <form action={createAnnouncement} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"><input name="title" placeholder="Title" required className="rounded-md border border-slate-300 px-3 py-2 text-sm" /><textarea name="message" placeholder="Message" required rows={4} className="resize-none rounded-md border border-slate-300 px-3 py-2 text-sm" /><label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="isActive" defaultChecked /> Active</label><div className="flex justify-end"><button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white">Create Announcement</button></div></form> : null}
        <section className="grid gap-4">{announcements.length === 0 ? <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No announcements found.</div> : announcements.map((announcement) => <article key={announcement.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-lg font-semibold text-slate-950">{announcement.title}</h2><p className="mt-2 text-sm text-slate-600">{announcement.message}</p><p className="mt-3 text-xs text-slate-400">By {announcement.createdBy.name}</p></div>{isAdmin ? <div className="flex gap-3"><a href={`/announcements/${announcement.id}/edit`} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">Edit</a><form action={async () => { "use server"; await toggleAnnouncementActive(announcement.id, !announcement.isActive); }}><button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">{announcement.isActive ? "Deactivate" : "Activate"}</button></form></div> : null}</div></article>)}</section>
      </div>
    </DashboardLayout>
  );
}
