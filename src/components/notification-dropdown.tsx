"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import {
  getNotifications,
  markNotificationsAsRead,
  followUser,
  unfollowUser,
  getCurrentUsername,
} from "@/app/friends/actions";
import {
  FollowNotification,
  PrayerSharedNotification,
  PrayedForNotification,
} from "@/components/notification-items";
import type { NotificationItem } from "@/lib/types";

export function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      try {
        const [data, username] = await Promise.all([
          getNotifications(),
          getCurrentUsername(),
        ]);
        setNotifications(data);
        setCurrentUsername(username);
        await markNotificationsAsRead();
      } catch {
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
    <div className="w-full bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200 overflow-hidden z-50">
      <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-2">
        <Bell size={16} className="text-stone-500" />
        <h3 className="font-serif font-bold text-stone-900">Notifications</h3>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-stone-400">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Bell size={28} className="mx-auto text-stone-300 mb-2" />
            <p className="text-sm text-stone-400">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 flex items-center gap-3 ${
                  !notification.read ? "bg-emerald-50/50" : ""
                }`}
              >
                {notification.type === "FOLLOW" && (
                  <FollowNotification
                    notification={notification}
                    onClose={onClose}
                    onFollowToggle={handleFollowToggle}
                    isPending={isPending}
                  />
                )}
                {notification.type === "PRAYER_SHARED" && (
                  <PrayerSharedNotification
                    notification={notification}
                    onClose={onClose}
                  />
                )}
                {notification.type === "PRAYED_FOR" && (
                  <PrayedForNotification
                    notification={notification}
                    currentUsername={currentUsername}
                    onClose={onClose}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && notifications.length > 0 && (
        <div className="border-t border-stone-100 px-4 py-2.5 text-center">
          <Link
            href="/notifications"
            onClick={onClose}
            className="text-xs font-medium text-stone-500 hover:text-emerald-700 transition-colors"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
