"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteEmployee } from "@/app/employees/actions";

type DeleteEmployeeButtonProps = {
  employeeId: string;
};

export default function DeleteEmployeeButton({
  employeeId,
}: DeleteEmployeeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteEmployee(employeeId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm font-medium text-red-600 transition hover:text-red-700 disabled:opacity-60"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
