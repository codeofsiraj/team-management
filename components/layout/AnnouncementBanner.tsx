"use client";

import { useEffect, useState } from "react";

type Announcement = {
  id: string;
  title: string;
  message: string;
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

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    setDismissedIds(stored ? JSON.parse(stored) : []);
  }, [storageKey]);

  const visibleAnnouncements = announcements.filter(
    (announcement) => !dismissedIds.includes(announcement.id)
  );

  function dismissAnnouncement(id: string) {
    const nextDismissedIds = [...dismissedIds, id];
    setDismissedIds(nextDismissedIds);
    window.localStorage.setItem(storageKey, JSON.stringify(nextDismissedIds));
  }

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-[#E5E7EB] bg-gradient-to-r from-[#770FC2]/10 via-white to-[#A05DD0]/10 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-2">
        {visibleAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className="flex flex-col gap-3 rounded-md border border-[#A05DD0]/25 bg-white/85 px-4 py-3 shadow-sm backdrop-blur transition duration-200 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-[#1F2937]">
                {announcement.title}
              </p>
              <p className="mt-1 text-sm text-[#6B7280]">
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
        ))}
      </div>
    </div>
  );
}
