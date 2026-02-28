import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

const FROM_EMAIL = "Sola Scriptura <noreply@support.cgdiomampo.dev>";

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${env.AUTH_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verify your email — Sola Scriptura",
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #1c1917;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">Verify your email</h1>
        <p style="color: #78716c; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Thanks for signing up for Sola Scriptura! Click the button below to verify your email address.
        </p>
        <a href="${verifyUrl}" style="display: inline-block; background-color: #1c1917; color: #fafaf9; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 500; font-size: 15px;">
          Verify Email
        </a>
        <p style="color: #a8a29e; font-size: 13px; margin-top: 24px; line-height: 1.5;">
          This link expires in 1 hour. If you didn&rsquo;t create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${env.AUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your password — Sola Scriptura",
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #1c1917;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">Reset your password</h1>
        <p style="color: #78716c; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          We received a request to reset your password. Click the button below to choose a new one.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #1c1917; color: #fafaf9; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 500; font-size: 15px;">
          Reset Password
        </a>
        <p style="color: #a8a29e; font-size: 13px; margin-top: 24px; line-height: 1.5;">
          This link expires in 1 hour. If you didn&rsquo;t request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};
