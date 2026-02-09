"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BookOpen, ArrowLeft, Search, Users, UserX } from "lucide-react";
import { FriendCard } from "@/components/friend-card";
import {
  searchUsers,
  followUser,
  unfollowUser,
} from "@/app/friends/actions";
import type { FriendUser } from "@/lib/types";

interface FriendsClientProps {
  initialFollowing: FriendUser[];
  stats: { followingCount: number; followerCount: number };
}

export function FriendsClient({ initialFollowing, stats }: FriendsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [following, setFollowing] = useState(initialFollowing);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FriendUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch {
        toast.error("Failed to search users");
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFollowToggle = (userId: string, isCurrentlyFollowing: boolean) => {
    if (isCurrentlyFollowing) {
      // Optimistic unfollow
      setFollowing((prev) => prev.filter((u) => u.id !== userId));
      setSearchResults((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isFollowing: false } : u))
      );
      toast.success("Unfollowed");

      startTransition(async () => {
        try {
          await unfollowUser(userId);
        } catch {
          setFollowing(initialFollowing);
          toast.error("Failed to unfollow");
        }
      });
    } else {
      // Optimistic follow
      const user =
        searchResults.find((u) => u.id === userId) ||
        following.find((u) => u.id === userId);
      if (user) {
        setFollowing((prev) => [{ ...user, isFollowing: true }, ...prev]);
      }
      setSearchResults((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isFollowing: true } : u))
      );
      toast.success("Following!");

      startTransition(async () => {
        try {
          await followUser(userId);
        } catch {
          setFollowing(initialFollowing);
          toast.error("Failed to follow");
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="bg-stone-900 text-white p-2 rounded-xl">
              <BookOpen size={20} />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">
              Sola Scriptura
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-1">
            My Friends
          </h1>
          <p className="text-stone-500">
            {stats.followingCount} following &middot; {stats.followerCount}{" "}
            {stats.followerCount === 1 ? "follower" : "followers"}
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-6 sm:p-8 border border-stone-100">
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">
            Find People
          </h2>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-stone-300"
            />
          </div>

          {isSearching && (
            <div className="mt-4 text-center text-sm text-stone-400">
              Searching...
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-3">
              {searchResults.map((user) => (
                <FriendCard
                  key={user.id}
                  user={user}
                  onFollowToggle={handleFollowToggle}
                  isPending={isPending}
                />
              ))}
            </div>
          )}

          {searchQuery.length >= 2 &&
            !isSearching &&
            searchResults.length === 0 && (
              <div className="mt-4 text-center py-6">
                <UserX size={32} className="mx-auto text-stone-300 mb-2" />
                <p className="text-sm text-stone-400">
                  No users found matching &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            )}
        </div>

        {/* Following List */}
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-6 sm:p-8 border border-stone-100">
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">
            People You Follow
          </h2>

          {following.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-stone-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users size={32} className="text-stone-400" />
              </div>
              <p className="text-stone-500 font-medium">
                You&apos;re not following anyone yet
              </p>
              <p className="text-stone-400 text-sm mt-1">
                Search for friends by username above
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {following.map((user) => (
                <FriendCard
                  key={user.id}
                  user={user}
                  onFollowToggle={handleFollowToggle}
                  isPending={isPending}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
