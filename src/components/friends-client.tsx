"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Search, Users, UserX, UserCheck } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { FriendCard } from "@/components/friend-card";
import {
  searchUsers,
  followUser,
  unfollowUser,
} from "@/app/friends/actions";
import type { FriendUser, Stats } from "@/lib/types";

type Tab = "following" | "followers";

interface FriendsClientProps {
  initialFollowing: FriendUser[];
  initialFollowers: FriendUser[];
  stats: { followingCount: number; followerCount: number };
  navbarStats: Stats;
  unreadNotificationCount: number;
}

export function FriendsClient({
  initialFollowing,
  initialFollowers,
  stats,
  navbarStats,
  unreadNotificationCount,
}: FriendsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [following, setFollowing] = useState(initialFollowing);
  const [followers, setFollowers] = useState(initialFollowers);
  const [followerCount] = useState(stats.followerCount);
  const [activeTab, setActiveTab] = useState<Tab>("following");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FriendUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const followingCount = following.length;

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
      setFollowers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isFollowing: false } : u))
      );
      setSearchResults((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isFollowing: false } : u))
      );
      toast.success("Unfollowed");

      startTransition(async () => {
        try {
          await unfollowUser(userId);
        } catch {
          setFollowing(initialFollowing);
          setFollowers(initialFollowers);
          toast.error("Failed to unfollow");
        }
      });
    } else {
      // Optimistic follow
      const user =
        searchResults.find((u) => u.id === userId) ||
        followers.find((u) => u.id === userId) ||
        following.find((u) => u.id === userId);
      if (user) {
        setFollowing((prev) => [{ ...user, isFollowing: true }, ...prev]);
      }
      setFollowers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isFollowing: true } : u))
      );
      setSearchResults((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isFollowing: true } : u))
      );
      toast.success("Following!");

      startTransition(async () => {
        try {
          await followUser(userId);
        } catch {
          setFollowing(initialFollowing);
          setFollowers(initialFollowers);
          toast.error("Failed to follow");
        }
      });
    }
  };

  const displayList = activeTab === "following" ? following : followers;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar stats={navbarStats} unreadCount={unreadNotificationCount} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mb-1">
            My Friends
          </h1>
          <p className="text-stone-500">
            <button
              type="button"
              onClick={() => setActiveTab("following")}
              className={`hover:text-stone-700 transition-colors ${
                activeTab === "following" ? "text-stone-900 font-semibold" : ""
              }`}
            >
              {followingCount} following
            </button>
            {" \u00B7 "}
            <button
              type="button"
              onClick={() => setActiveTab("followers")}
              className={`hover:text-stone-700 transition-colors ${
                activeTab === "followers" ? "text-stone-900 font-semibold" : ""
              }`}
            >
              {followerCount}{" "}
              {followerCount === 1 ? "follower" : "followers"}
            </button>
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

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("following")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "following"
                ? "bg-stone-900 text-stone-50"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            <Users size={16} />
            <span>Following</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === "following"
                  ? "bg-stone-700 text-stone-200"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              {followingCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("followers")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "followers"
                ? "bg-stone-900 text-stone-50"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            <UserCheck size={16} />
            <span>Followers</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === "followers"
                  ? "bg-stone-700 text-stone-200"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              {followerCount}
            </span>
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-6 sm:p-8 border border-stone-100">
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">
            {activeTab === "following" ? "People You Follow" : "Your Followers"}
          </h2>

          {displayList.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-stone-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users size={32} className="text-stone-400" />
              </div>
              <p className="text-stone-500 font-medium">
                {activeTab === "following"
                  ? "You\u2019re not following anyone yet"
                  : "No one is following you yet"}
              </p>
              <p className="text-stone-400 text-sm mt-1">
                {activeTab === "following"
                  ? "Search for friends by username above"
                  : "Share your profile to get followers"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayList.map((user) => (
                <FriendCard
                  key={user.id}
                  user={user}
                  onFollowToggle={handleFollowToggle}
                  isPending={isPending}
                  followLabel={activeTab === "followers" ? "Follow Back" : "Follow"}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
