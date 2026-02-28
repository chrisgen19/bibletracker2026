"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/tokens";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function resetPasswordAction(
  token: string,
  email: string,
  formData: { newPassword: string; confirmPassword: string }
) {
  const parsed = resetPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError =
      fieldErrors.newPassword?.[0] ??
      fieldErrors.confirmPassword?.[0] ??
      "Invalid input.";
    return { success: false, error: firstError };
  }

  const identifier = `password_reset:${email}`;
  const result = await verifyToken(identifier, token);

  if (!result.valid) {
    return {
      success: false,
      error:
        result.error === "Token expired"
          ? "This reset link has expired. Please request a new one."
          : "Invalid reset link. Please request a new one.",
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: "User not found." };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 12);

  // Update password and mark email as verified (user proved email ownership)
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      emailVerified: user.emailVerified ?? new Date(),
    },
  });

  return { success: true, error: null };
}
