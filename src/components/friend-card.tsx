import Link from "next/link";
import { UserCircle, UserPlus, UserMinus } from "lucide-react";
import type { FriendUser } from "@/lib/types";

interface FriendCardProps {
  user: FriendUser;
  onFollowToggle: (userId: string, isFollowing: boolean) => void;
  isPending?: boolean;
}

export function FriendCard({ user, onFollowToggle, isPending }: FriendCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-stone-100 bg-stone-50 hover:bg-stone-100/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="bg-stone-200 p-2 rounded-full flex-shrink-0">
          <UserCircle size={24} className="text-stone-500" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-stone-900 truncate">
            {user.firstName} {user.lastName}
          </p>
          <Link
            href={`/u/${user.username}`}
            className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            @{user.username}
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onFollowToggle(user.id, user.isFollowing)}
        disabled={isPending}
        className={`
          flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0
          ${
            user.isFollowing
              ? "bg-stone-200 text-stone-700 hover:bg-red-50 hover:text-red-600"
              : "bg-stone-900 text-stone-50 hover:bg-stone-800"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {user.isFollowing ? (
          <>
            <UserMinus size={14} />
            <span>Unfollow</span>
          </>
        ) : (
          <>
            <UserPlus size={14} />
            <span>Follow</span>
          </>
        )}
      </button>
    </div>
  );
}
