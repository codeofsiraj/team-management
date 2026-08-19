"use client";

import { useEffect, useState, useTransition } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

type PushNotificationToggleProps = {
  compact?: boolean;
};

export default function PushNotificationToggle({
  compact = false,
}: PushNotificationToggleProps) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const [status, setStatus] = useState("Checking notification support...");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("Browser push notifications are not available.");
      return;
    }

    if (!publicKey) {
      setStatus("Push notifications are not configured.");
      return;
    }

    navigator.serviceWorker
      .register("/push-sw.js")
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => {
        setIsEnabled(Boolean(subscription));
        setStatus(
          subscription
            ? "Browser push notifications are enabled."
            : Notification.permission === "denied"
              ? "Notification permission is blocked in this browser."
              : "Enable browser push notifications for important updates."
        );
      })
      .catch(() => setStatus("Unable to check push notification status."));
  }, [publicKey]);

  function enablePush() {
    startTransition(async () => {
      if (!publicKey || Notification.permission === "denied") {
        setStatus("Notification permission is blocked in this browser.");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setStatus("Notification permission was not granted.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setIsEnabled(true);
      setStatus("Browser push notifications are enabled.");
    });
  }

  function disablePush() {
    startTransition(async () => {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }

      setIsEnabled(false);
      setStatus("Browser push notifications are disabled.");
    });
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-md border border-[#E5E7EB] bg-[#F8F7FB] px-3 py-2 text-xs">
        <div className="min-w-0">
          <p className="font-medium text-[#1F2937]">Push Alerts</p>
          <p className="truncate text-[#6B7280]">
            {isEnabled ? "Enabled" : "Disabled"}
          </p>
        </div>
        <button
          type="button"
          onClick={isEnabled ? disablePush : enablePush}
          disabled={isPending || !publicKey}
          className="shrink-0 rounded border border-[#A05DD0]/30 bg-white px-2 py-1 font-medium text-[#770FC2] shadow-xs transition hover:bg-[#F3E8FF] disabled:opacity-50"
        >
          {isPending ? "..." : isEnabled ? "Disable" : "Enable"}
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#1F2937]">
            Browser Push Notifications
          </p>
          <p className="mt-1 text-sm text-[#6B7280]">{status}</p>
        </div>
        <button
          type="button"
          onClick={isEnabled ? disablePush : enablePush}
          disabled={isPending || !publicKey}
          className="rounded-md border border-[#770FC2] px-4 py-2 text-sm font-medium text-[#770FC2] transition hover:bg-[#F3E8FF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isEnabled ? "Disable" : "Enable"}
        </button>
      </div>
    </section>
  );
}
