"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex w-auto items-center justify-center rounded-md border border-[#A05DD0]/40 bg-white px-4 py-2 text-sm font-medium text-[#770FC2] shadow-sm transition duration-200 hover:border-[#770FC2] hover:bg-[#F3E8FF]"
    >
      Logout
    </button>
  );
}
