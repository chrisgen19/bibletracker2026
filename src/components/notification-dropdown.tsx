"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell, UserPlus, UserMinus, UserCircle } from "lucide-react";
import {
  getNotifications,
  markNotificationsAsRead,
  followUser,
  unfollowUser,
} from "@/app/friends/actions";
import type { NotificationItem } from "@/lib/types";

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      try {
        const data = await getNotifications();
        setNotifications(data);
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
                <div className="bg-stone-200 p-1.5 rounded-full flex-shrink-0">
                  <UserCircle size={20} className="text-stone-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-800">
                    <Link
                      href={`/u/${notification.actor.username}`}
                      onClick={onClose}
                      className="font-semibold hover:text-emerald-700 transition-colors"
                    >
                      {notification.actor.firstName} {notification.actor.lastName}
                    </Link>{" "}
                    followed you
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {timeAgo(notification.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleFollowToggle(
                      notification.actor.id,
                      notification.actor.isFollowing
                    )
                  }
                  disabled={isPending}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex-shrink-0 ${
                    notification.actor.isFollowing
                      ? "bg-stone-200 text-stone-700 hover:bg-red-50 hover:text-red-600"
                      : "bg-stone-900 text-stone-50 hover:bg-stone-800"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {notification.actor.isFollowing ? (
                    <>
                      <UserMinus size={12} />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={12} />
                      <span>Follow Back</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
