"use client";

import { ReactNode } from "react";

type MenuActionButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
};

export default function MenuActionButton({
  children,
  onClick,
  disabled,
  danger,
}: MenuActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-3 py-2 text-left text-sm transition disabled:opacity-60 ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-[#1F2937] hover:bg-[#F3E8FF] hover:text-[#770FC2]"
      }`}
    >
      {children}
    </button>
  );
}
