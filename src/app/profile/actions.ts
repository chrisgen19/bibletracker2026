"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/lib/validations/profile";

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      phoneNumber: true,
      country: true,
      gender: true,
      birthday: true,
      createdAt: true,
      isProfilePublic: true,
      calendarDisplayMode: true,
    },
  });

  if (!user) throw new Error("User not found");

  return {
    ...user,
    birthday: user.birthday.toISOString().split("T")[0],
    username: user.username ?? "",
    phoneNumber: user.phoneNumber ?? "",
    createdAt: user.createdAt.toISOString(),
    isProfilePublic: user.isProfilePublic,
    calendarDisplayMode: user.calendarDisplayMode,
  };
}

export type ProfileData = Awaited<ReturnType<typeof getProfile>>;

export async function updateProfile(formData: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = updateProfileSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, username, phoneNumber, country, gender, birthday } =
    parsed.data;

  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== session.user.id) {
      return { error: "This username is already taken" };
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName,
      lastName,
      username: username || null,
      phoneNumber: phoneNumber || null,
      country,
      gender,
      birthday: new Date(birthday),
    },
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function changePassword(formData: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = changePasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user?.password) return { error: "User not found" };

  const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!isValid) return { error: "Current password is incorrect" };

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  return { success: true };
}

export async function toggleProfilePrivacy() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isProfilePublic: true },
  });

  if (!user) return { error: "User not found" };

  const newValue = !user.isProfilePublic;
  await prisma.user.update({
    where: { id: session.user.id },
    data: { isProfilePublic: newValue },
  });

  revalidatePath("/profile");
  return { success: true, isProfilePublic: newValue };
}

export async function updateCalendarDisplayMode(mode: "DOTS_ONLY" | "REFERENCES_WITH_DOTS" | "REFERENCES_ONLY") {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { calendarDisplayMode: mode },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
