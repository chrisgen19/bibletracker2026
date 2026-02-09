import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getFollowing, getFollowCounts } from "./actions";
import { FriendsClient } from "@/components/friends-client";

export default async function FriendsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [following, stats] = await Promise.all([
    getFollowing(),
    getFollowCounts(),
  ]);

  return <FriendsClient initialFollowing={following} stats={stats} />;
}
