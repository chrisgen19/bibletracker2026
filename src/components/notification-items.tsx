import Link from "next/link";
import { UserCircle, UserPlus, UserMinus, HandHeart, Heart, Check } from "lucide-react";
import type { NotificationItem } from "@/lib/types";

export const timeAgo = (dateStr: string): string => {
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
};

export const formatFullDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export function FollowNotification({
  notification,
  onClose,
  onFollowToggle,
  isPending,
  showFullDate,
}: {
  notification: NotificationItem;
  onClose?: () => void;
  onFollowToggle: (actorId: string, isFollowing: boolean) => void;
  isPending: boolean;
  showFullDate?: boolean;
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
          {showFullDate
            ? formatFullDate(notification.createdAt)
            : timeAgo(notification.createdAt)}
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

export function PrayerSharedNotification({
  notification,
  onClose,
  showFullDate,
}: {
  notification: NotificationItem;
  onClose?: () => void;
  showFullDate?: boolean;
}) {
  const href = notification.prayer
    ? `/u/${notification.actor.username}/prayers/${notification.prayer.id}`
    : `/u/${notification.actor.username}`;

  return (
    <Link href={href} onClick={onClose} className="flex items-center gap-3 w-full">
      <div className="bg-amber-100 p-1.5 rounded-full flex-shrink-0">
        <HandHeart size={20} className="text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-800">
          <span className="font-semibold">
            {notification.actor.firstName} {notification.actor.lastName}
          </span>{" "}
          shared a prayer request
        </p>
        {notification.prayer && (
          <p className="text-xs text-stone-500 mt-0.5 truncate">
            {notification.prayer.title}
          </p>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-stone-400">
            {showFullDate
              ? formatFullDate(notification.createdAt)
              : timeAgo(notification.createdAt)}
          </p>
          {notification.prayer?.hasPrayed && (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
              <Check size={11} />
              Prayed
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function PrayedForNotification({
  notification,
  currentUsername,
  onClose,
  showFullDate,
}: {
  notification: NotificationItem;
  currentUsername: string | null;
  onClose?: () => void;
  showFullDate?: boolean;
}) {
  const href = notification.prayer && currentUsername
    ? `/u/${currentUsername}/prayers/${notification.prayer.id}`
    : `/u/${notification.actor.username}`;

  return (
    <Link href={href} onClick={onClose} className="flex items-center gap-3 w-full">
      <div className="bg-emerald-100 p-1.5 rounded-full flex-shrink-0">
        <Heart size={20} className="text-emerald-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-800">
          <span className="font-semibold">
            {notification.actor.firstName} {notification.actor.lastName}
          </span>{" "}
          prayed for your request
        </p>
        {notification.prayer && (
          <p className="text-xs text-stone-500 mt-0.5 truncate">
            {notification.prayer.title}
          </p>
        )}
        <p className="text-xs text-stone-400 mt-0.5">
          {showFullDate
            ? formatFullDate(notification.createdAt)
            : timeAgo(notification.createdAt)}
        </p>
      </div>
    </Link>
  );
}
