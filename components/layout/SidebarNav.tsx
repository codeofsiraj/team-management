"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/layout/LogoutButton";

type NavItem = {
  label: string;
  href: string;
};

type SidebarNavProps = {
  items: NavItem[];
  unreadNotifications?: number;
};

export default function SidebarNav({
  items,
  unreadNotifications = 0,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-slate-950 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <span>{item.label}</span>
            {item.href === "/notifications" && unreadNotifications > 0 ? (
              <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                {unreadNotifications}
              </span>
            ) : null}
          </Link>
        );
      })}
      <div className="min-w-28 lg:min-w-0">
        <LogoutButton />
      </div>
    </nav>
  );
}
