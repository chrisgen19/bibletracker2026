"use server";

import { prisma } from "@/lib/db";
import { createVerificationToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export async function forgotPasswordAction(formData: { email: string }) {
  const parsed = forgotPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to avoid revealing if email exists
  if (!user) {
    return { success: true, error: null };
  }

  const identifier = `password_reset:${email}`;
  const token = await createVerificationToken(identifier);
  await sendPasswordResetEmail(email, token);

  return { success: true, error: null };
}
