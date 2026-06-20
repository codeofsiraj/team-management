"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex w-auto items-center justify-center rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-white hover:text-[#770FC2]"
    >
      Logout
    </button>
  );
}
