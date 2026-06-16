"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteTeam } from "@/app/teams/actions";

type DeleteTeamButtonProps = {
  teamId: string;
};

export default function DeleteTeamButton({ teamId }: DeleteTeamButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this team?"
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteTeam(teamId);
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
