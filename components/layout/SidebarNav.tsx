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
    <nav className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
      {items.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition duration-200 ${
              isActive
                ? "bg-[#6B1BBD] text-white shadow-sm"
                : "text-[#4B5563] hover:bg-[#F3E8FF] hover:text-[#770FC2]"
            }`}
          >
            <span>{item.label}</span>
            {item.href === "/notifications" && unreadNotifications > 0 ? (
              <span className="ml-2 rounded-full bg-[#A05DD0] px-2 py-0.5 text-xs text-white">
                {unreadNotifications}
              </span>
            ) : null}
          </Link>
        );
      })}
      <div className="min-w-fit pl-3 lg:mt-3">
        <LogoutButton />
      </div>
    </nav>
  );
}
