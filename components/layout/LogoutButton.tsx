"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-white/85 transition duration-200 hover:bg-[#6B1BBD] hover:text-white"
    >
      Logout
    </button>
  );
}
