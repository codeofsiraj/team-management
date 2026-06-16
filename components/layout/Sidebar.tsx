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
  const roleLabel = role ?? "admin";

  return (
    <aside className="flex border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex w-full flex-col gap-4 p-4 lg:p-6">
        <div>
          <p className="text-lg font-semibold text-slate-950">Team Manager</p>
          <p className="text-sm capitalize text-slate-500">
            {roleLabel} workspace
          </p>
        </div>

        <SidebarNav items={navItems} unreadNotifications={unreadNotifications} />
      </div>
    </aside>
  );
}
