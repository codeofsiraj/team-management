import { ReactNode } from "react";

type ActionMenuProps = {
  children: ReactNode;
  label?: string;
};

export default function ActionMenu({
  children,
  label = "Open row menu",
}: ActionMenuProps) {
  return (
    <details className="group relative inline-block text-left">
      <summary
        aria-label={label}
        className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-sm font-semibold leading-none text-[#6B7280] transition hover:border-[#A05DD0] hover:bg-[#F3E8FF] hover:text-[#770FC2] [&::-webkit-details-marker]:hidden"
      >
        ...
      </summary>
      <div className="absolute right-0 z-20 mt-2 min-w-36 max-w-[calc(100vw-2rem)] rounded-md border border-[#E5E7EB] bg-white p-1 shadow-lg">
        <div className="grid gap-1">{children}</div>
      </div>
    </details>
  );
}
