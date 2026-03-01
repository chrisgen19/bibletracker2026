"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell, UserPlus, UserMinus, UserCircle, HandHeart, Heart } from "lucide-react";
import {
  getNotifications,
  markNotificationsAsRead,
  followUser,
  unfollowUser,
  getCurrentUsername,
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

function FollowNotification({
  notification,
  onClose,
  onFollowToggle,
  isPending,
}: {
  notification: NotificationItem;
  onClose: () => void;
  onFollowToggle: (actorId: string, isFollowing: boolean) => void;
  isPending: boolean;
}) {
  return (
    <>
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
          onFollowToggle(
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
    </>
  );
}

function PrayerSharedNotification({
  notification,
  onClose,
}: {
  notification: NotificationItem;
  onClose: () => void;
}) {
  return (
    <>
      <div className="bg-amber-100 p-1.5 rounded-full flex-shrink-0">
        <HandHeart size={20} className="text-amber-600" />
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
          shared a prayer request
        </p>
        {notification.prayer && (
          <p className="text-xs text-stone-500 mt-0.5 truncate">
            {notification.prayer.title}
          </p>
        )}
        <p className="text-xs text-stone-400 mt-0.5">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      {notification.prayer && (
        <Link
          href={`/u/${notification.actor.username}/prayers/${notification.prayer.id}`}
          onClick={onClose}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all flex-shrink-0"
        >
          Read
        </Link>
      )}
    </>
  );
}

function PrayedForNotification({
  notification,
  currentUsername,
  onClose,
}: {
  notification: NotificationItem;
  currentUsername: string | null;
  onClose: () => void;
}) {
  return (
    <>
      <div className="bg-emerald-100 p-1.5 rounded-full flex-shrink-0">
        <Heart size={20} className="text-emerald-600" />
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
          prayed for your request
        </p>
        {notification.prayer && (
          <p className="text-xs text-stone-500 mt-0.5 truncate">
            {notification.prayer.title}
          </p>
        )}
        <p className="text-xs text-stone-400 mt-0.5">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      {notification.prayer && currentUsername && (
        <Link
          href={`/u/${currentUsername}/prayers/${notification.prayer.id}`}
          onClick={onClose}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all flex-shrink-0"
        >
          View
        </Link>
      )}
    </>
  );
}

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
    </div>
  );
}
