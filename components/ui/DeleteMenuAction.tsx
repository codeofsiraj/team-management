"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import MenuActionButton from "@/components/ui/MenuActionButton";

type DeleteMenuActionProps = {
  id: string;
  action: (id: string) => Promise<void>;
  message: string;
  label?: string;
};

export default function DeleteMenuAction({
  id,
  action,
  message,
  label = "Delete",
}: DeleteMenuActionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(message)) {
      return;
    }

    startTransition(async () => {
      await action(id);
      router.refresh();
    });
  }

  return (
    <MenuActionButton onClick={handleDelete} disabled={isPending} danger>
      {isPending ? "Deleting..." : label}
    </MenuActionButton>
  );
}
