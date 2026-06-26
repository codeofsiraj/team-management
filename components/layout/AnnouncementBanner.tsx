"use client";

import { useEffect, useState, useTransition } from "react";
import { markNotificationRead } from "@/app/notifications/actions";

type Announcement = {
  id: string;
  title: string;
  message: string;
  important?: boolean;
};

type AnnouncementBannerProps = {
  announcements: Announcement[];
  userId?: string;
};

export default function AnnouncementBanner({
  announcements,
  userId,
}: AnnouncementBannerProps) {
  const storageKey = `digiart-dismissed-announcements:${userId ?? "guest"}`;
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    setDismissedIds(stored ? JSON.parse(stored) : []);
  }, [storageKey]);

  const visibleAnnouncements = announcements.filter(
    (announcement) => !dismissedIds.includes(announcement.id)
  );

  useEffect(() => {
    if (isPaused || visibleAnnouncements.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % visibleAnnouncements.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [isPaused, visibleAnnouncements.length]);

  function dismissAnnouncement(id: string) {
    const nextDismissedIds = [...dismissedIds, id];
    setDismissedIds(nextDismissedIds);
    window.localStorage.setItem(storageKey, JSON.stringify(nextDismissedIds));
    startTransition(() => {
      void markNotificationRead(id);
    });
  }

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  const announcement =
    visibleAnnouncements[currentIndex % visibleAnnouncements.length];

  return (
    <div className="border-b border-[#E5E7EB] bg-gradient-to-r from-[#770FC2]/10 via-white to-[#A05DD0]/10 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-2">
        <div
          className="flex flex-col gap-3 rounded-md border border-[#A05DD0]/25 bg-white/85 px-4 py-3 shadow-sm backdrop-blur transition duration-200 sm:flex-row sm:items-center sm:justify-between"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div>
            {announcement.important ? (
              <span className="mb-2 inline-flex rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                IMPORTANT
              </span>
            ) : null}
              <p className="text-sm font-semibold text-[#1F2937]">
                {announcement.title}
              </p>
              <p className="mt-1 whitespace-pre-line break-words text-sm text-[#6B7280]">
                {announcement.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dismissAnnouncement(announcement.id)}
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#1F2937] px-3 py-1.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-[#6B1BBD]"
            >
              Noted &#x2705;
            </button>
          </div>
        {visibleAnnouncements.length > 1 ? (
          <div className="flex justify-center gap-1">
            {visibleAnnouncements.map((item, index) => (
              <span
                key={item.id}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === currentIndex ? "bg-[#770FC2]" : "bg-[#D8B4FE]"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
