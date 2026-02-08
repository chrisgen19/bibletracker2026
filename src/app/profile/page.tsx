import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfile } from "./actions";
import { ProfileClient } from "@/components/profile-client";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await getProfile();
  return <ProfileClient initialProfile={profile} />;
}
