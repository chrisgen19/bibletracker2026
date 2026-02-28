"use server";

import { prisma } from "@/lib/db";
import { createVerificationToken, verifyToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function verifyEmailAction(token: string, email: string) {
  const identifier = `email_verify:${email}`;
  const result = await verifyToken(identifier, token);

  if (!result.valid) {
    return {
      success: false,
      error:
        result.error === "Token expired"
          ? "This verification link has expired. Please request a new one."
          : "Invalid verification link. Please request a new one.",
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: "User not found." };
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  return { success: true, error: null };
}

export async function resendVerificationAction(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal whether email exists — always show success
    return { success: true, error: null };
  }

  if (user.emailVerified) {
    return { success: false, error: "Email is already verified." };
  }

  // Rate limit: check if a token was created in the last 60 seconds
  const existingToken = await prisma.verificationToken.findFirst({
    where: {
      identifier: `email_verify:${email}`,
      // Token created less than 60s ago means expires is still > now + 59min
      expires: { gt: new Date(Date.now() + 59 * 60 * 1000) },
    },
  });

  if (existingToken) {
    return {
      success: false,
      error: "Please wait before requesting another email.",
    };
  }

  const identifier = `email_verify:${email}`;
  const token = await createVerificationToken(identifier);
  await sendVerificationEmail(email, token);

  return { success: true, error: null };
}
