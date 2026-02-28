import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be 50 characters or less")
      .trim(),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be 50 characters or less")
      .trim(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be 30 characters or less")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, hyphens, and underscores"
      )
      .trim()
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be 128 characters or less")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    birthday: z
      .string()
      .min(1, "Birthday is required")
      .refine(
        (val) => {
          const date = new Date(val);
          const now = new Date();
          const age =
            (now.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
          return age >= 13;
        },
        { message: "You must be at least 13 years old" }
      ),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
      error: "Please select a gender",
    }),
    phoneNumber: z
      .string()
      .regex(/^\+?[0-9\s\-()]+$/, "Please enter a valid phone number")
      .min(7, "Phone number is too short")
      .max(20, "Phone number is too long")
      .optional()
      .or(z.literal("")),
    country: z.string().min(1, "Country is required"),
    termsAccepted: z.literal(true, {
      error: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email")
    .trim()
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be 128 characters or less")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const resetPasswordSchema = z
  .object({
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
