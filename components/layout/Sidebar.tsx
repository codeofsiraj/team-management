import SidebarNav from "@/components/layout/SidebarNav";

type SidebarProps = {
  role?: string;
  unreadNotifications?: number;
};

function getNavItems(role?: string) {
  if (role === "manager") {
    return [
      { label: "Manager Dashboard", href: "/manager" },
      { label: "Tasks", href: "/tasks" },
      { label: "Daily Updates", href: "/updates" },
      { label: "Learnings", href: "/learnings" },
      { label: "AI Tools", href: "/tools" },
      { label: "Research Docs", href: "/research" },
      { label: "Activity", href: "/activity" },
      { label: "Notifications", href: "/notifications" },
      { label: "Announcements", href: "/announcements" },
      { label: "Search", href: "/search" },
    ];
  }

  if (role === "member") {
    return [
      { label: "My Dashboard", href: "/member" },
      { label: "My Tasks", href: "/tasks" },
      { label: "Daily Updates", href: "/updates" },
      { label: "Learnings", href: "/learnings" },
      { label: "AI Tools", href: "/tools" },
      { label: "Research Docs", href: "/research" },
      { label: "Activity", href: "/activity" },
      { label: "Notifications", href: "/notifications" },
      { label: "Announcements", href: "/announcements" },
      { label: "Search", href: "/search" },
    ];
  }

  return [
    { label: "Dashboard", href: "/" },
    { label: "Employees", href: "/employees" },
    { label: "Teams", href: "/teams" },
    { label: "Tasks", href: "/tasks" },
    { label: "Daily Updates", href: "/updates" },
    { label: "Learnings", href: "/learnings" },
    { label: "AI Tools", href: "/tools" },
    { label: "Research Docs", href: "/research" },
    { label: "Activity", href: "/activity" },
    { label: "Notifications", href: "/notifications" },
    { label: "Announcements", href: "/announcements" },
    { label: "Search", href: "/search" },
  ];
}

export default function Sidebar({ role, unreadNotifications = 0 }: SidebarProps) {
  const navItems = getNavItems(role);
  const dashboardTitle =
    role === "manager"
      ? "Manager Dashboard"
      : role === "member"
        ? "Employee Dashboard"
        : "Admin Dashboard";

  return (
    <aside className="flex border-b border-white/15 bg-[#770FC2] text-white shadow-xl shadow-purple-950/10 lg:min-h-screen lg:w-64 lg:flex-col lg:border-b-0 lg:border-r lg:border-white/15">
      <div className="flex w-full flex-col gap-4 p-4 lg:p-6">
        <div className="rounded-lg border border-white/15 bg-white/10 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-sm font-semibold text-white">
              DC
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                Digiart Creation
              </p>
              <p className="text-sm text-white/80">
                {dashboardTitle}
              </p>
            </div>
          </div>
        </div>

        <SidebarNav
          items={navItems}
          unreadNotifications={unreadNotifications}
        />
      </div>
    </aside>
  );
}
