"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { followUser, unfollowUser, markNotificationsAsRead } from "@/app/friends/actions";
import { Navbar } from "@/components/navbar";
import {
  FollowNotification,
  PrayerSharedNotification,
  PrayedForNotification,
} from "@/components/notification-items";
import type { NotificationItem, Stats } from "@/lib/types";

type FilterTab = "ALL" | "FOLLOW" | "PRAYER_SHARED" | "PRAYED_FOR";

const TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "ALL" },
  { label: "Follows", value: "FOLLOW" },
  { label: "Prayers Shared", value: "PRAYER_SHARED" },
  { label: "Prayed For", value: "PRAYED_FOR" },
];

interface NotificationsClientProps {
  initialNotifications: NotificationItem[];
  currentUsername: string | null;
  stats: Stats;
  unreadNotificationCount: number;
}

export function NotificationsClient({
  initialNotifications,
  currentUsername,
  stats,
  unreadNotificationCount,
}: NotificationsClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  const filtered =
    activeTab === "ALL"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  const handleFollowToggle = (actorId: string, isCurrentlyFollowing: boolean) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.actor.id === actorId
          ? { ...n, actor: { ...n.actor, isFollowing: !isCurrentlyFollowing } }
          : n
      )
    );

    startTransition(async () => {
      try {
        if (isCurrentlyFollowing) {
          await unfollowUser(actorId);
          toast.success("Unfollowed");
        } else {
          await followUser(actorId);
          toast.success("Following!");
        }
      } catch {
        setNotifications((prev) =>
          prev.map((n) =>
            n.actor.id === actorId
              ? { ...n, actor: { ...n.actor, isFollowing: isCurrentlyFollowing } }
              : n
          )
        );
        toast.error("Action failed");
      }
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <Navbar stats={stats} unreadCount={unreadNotificationCount} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Notifications
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Your recent activity and updates
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.value
                  ? "bg-stone-900 text-stone-50"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 px-6 py-16 text-center">
            <Bell size={36} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-500 font-medium">No notifications</p>
            <p className="text-sm text-stone-400 mt-1">
              {activeTab === "ALL"
                ? "You're all caught up!"
                : "No notifications in this category yet."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 divide-y divide-stone-100">
            {filtered.map((notification) => (
              <div
                key={notification.id}
                className="px-5 py-4 flex items-center gap-3"
              >
                {notification.type === "FOLLOW" && (
                  <FollowNotification
                    notification={notification}
                    onFollowToggle={handleFollowToggle}
                    isPending={isPending}
                    showFullDate
                  />
                )}
                {notification.type === "PRAYER_SHARED" && (
                  <PrayerSharedNotification
                    notification={notification}
                    showFullDate
                  />
                )}
                {notification.type === "PRAYED_FOR" && (
                  <PrayedForNotification
                    notification={notification}
                    currentUsername={currentUsername}
                    showFullDate
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
