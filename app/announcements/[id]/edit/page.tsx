import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { updateAnnouncement } from "@/app/announcements/actions";

type EditAnnouncementPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAnnouncementPage({
  params,
}: EditAnnouncementPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sessionUser = session.user as typeof session.user & {
    role?: string;
  };

  if (sessionUser.role !== "admin") {
    redirect("/announcements");
  }

  const { id } = await params;
  const announcement = await prisma.announcement.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      message: true,
      isActive: true,
    },
  });

  if (!announcement) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header>
          <Link
            href="/announcements"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            Back to Announcements
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">
            Edit Announcement
          </h1>
        </header>

        <form
          action={updateAnnouncement}
          className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <input type="hidden" name="id" value={announcement.id} />
          <input
            name="title"
            defaultValue={announcement.title}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            name="message"
            defaultValue={announcement.message}
            required
            rows={4}
            className="resize-none rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={announcement.isActive}
            />
            Active
          </label>
          <div className="flex justify-end">
            <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white">
              Update Announcement
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
