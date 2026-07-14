import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { checkIn, checkOut } from "@/app/attendance/actions";

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatTime(value: Date | null) {
  return value ? timeFormatter.format(value) : "Not recorded";
}

export default async function AttendancePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

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
  const where: Prisma.AttendanceRecordWhereInput =
    sessionUser.role === "admin"
      ? {}
      : sessionUser.role === "manager"
        ? { user: { teamId: currentUser?.teamId ?? "__no_team__" } }
        : { userId: sessionUser.id };
  const records = await prisma.attendanceRecord.findMany({
    where,
    orderBy: { date: "desc" },
    take: 60,
    include: { user: { select: { id: true, name: true } } },
  });
  const today = new Date();
  const todayDate = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const ownTodayRecord = sessionUser.id
    ? await prisma.attendanceRecord.findUnique({
        where: { userId_date: { userId: sessionUser.id, date: todayDate } },
      })
    : null;
  const showEmployeeColumn = sessionUser.role !== "member";

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-slate-500">
              Attendance
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">
              Attendance Tracking
            </h1>
          </div>
          {sessionUser.role !== "admin" ? (
            <div className="flex flex-wrap gap-2">
              <form action={checkIn}>
                <button
                  disabled={Boolean(ownTodayRecord?.actualCheckInTime)}
                  className="rounded-md bg-[#770FC2] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  Check-In
                </button>
              </form>
              <form action={checkOut}>
                <button
                  disabled={
                    !ownTodayRecord?.actualCheckInTime ||
                    Boolean(ownTodayRecord?.actualCheckOutTime)
                  }
                  className="rounded-md border border-[#770FC2] px-4 py-2 text-sm font-medium text-[#770FC2] disabled:opacity-50"
                >
                  Check-Out
                </button>
              </form>
            </div>
          ) : null}
        </header>
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {records.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No attendance records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1060px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    {showEmployeeColumn ? <th className="px-4 py-3">Employee</th> : null}
                    <th className="px-4 py-3">Scheduled Start Time</th>
                    <th className="px-4 py-3">Actual Check-In Time</th>
                    <th className="px-4 py-3">Scheduled End Time</th>
                    <th className="px-4 py-3">Actual Check-Out Time</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Late Duration</th>
                    <th className="px-4 py-3">Early Departure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-slate-600">{dateFormatter.format(record.date)}</td>
                      {showEmployeeColumn ? <td className="px-4 py-4 font-medium text-slate-950">{record.user.name}</td> : null}
                      <td className="px-4 py-4 text-slate-600">{record.scheduledStartTime}</td>
                      <td className="px-4 py-4 text-slate-600">{formatTime(record.actualCheckInTime)}</td>
                      <td className="px-4 py-4 text-slate-600">{record.scheduledEndTime}</td>
                      <td className="px-4 py-4 text-slate-600">{formatTime(record.actualCheckOutTime)}</td>
                      <td className="px-4 py-4 text-slate-600">{record.status}</td>
                      <td className="px-4 py-4 text-slate-600">{record.lateDurationMinutes ? `${record.lateDurationMinutes} min` : "None"}</td>
                      <td className="px-4 py-4 text-slate-600">{record.earlyDepartureMinutes ? `${record.earlyDepartureMinutes} min` : "None"}</td>
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
