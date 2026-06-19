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
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition duration-200 ${
              isActive
                ? "bg-[#A05DD0] text-white shadow-sm"
                : "text-white/85 hover:bg-[#6B1BBD] hover:text-white"
            }`}
          >
            <span>{item.label}</span>
            {item.href === "/notifications" && unreadNotifications > 0 ? (
              <span className="ml-2 rounded-full bg-[#A05DD0] px-2 py-0.5 text-xs text-white ring-1 ring-white/30">
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
