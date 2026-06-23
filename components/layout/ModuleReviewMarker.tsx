"use client";

import { useEffect, useTransition } from "react";
import { markModuleReviewed } from "@/app/module-alerts/actions";
import { ModuleKey } from "@/lib/moduleAlerts";

export default function ModuleReviewMarker({ module }: { module: ModuleKey }) {
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      void markModuleReviewed(module);
    });
  }, [module]);

  return null;
}
