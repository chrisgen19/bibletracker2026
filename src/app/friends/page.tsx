import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getFollowing, getFollowers, getFollowCounts } from "./actions";
import { FriendsClient } from "@/components/friends-client";

export default async function FriendsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [following, followers, stats] = await Promise.all([
    getFollowing(),
    getFollowers(),
    getFollowCounts(),
  ]);

  return (
    <FriendsClient
      initialFollowing={following}
      initialFollowers={followers}
      stats={stats}
    />
  );
}
