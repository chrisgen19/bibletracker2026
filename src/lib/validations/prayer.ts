import { z } from "zod";

export const createPrayerSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  content: z.string(),
  category: z.enum(
    [
      "PERSONAL",
      "FAMILY",
      "FRIENDS",
      "CHURCH",
      "MISSIONS",
      "HEALTH",
      "WORK",
      "OTHER",
    ],
    { error: "Please select a category" }
  ),
  scriptureReference: z
    .string()
    .max(100, "Scripture reference must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  isPublic: z.boolean(),
});

export type CreatePrayerFormData = z.infer<typeof createPrayerSchema>;

export const answerPrayerSchema = z.object({
  answeredNote: z
    .string()
    .max(2000, "Note must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
});

export type AnswerPrayerFormData = z.infer<typeof answerPrayerSchema>;

export const prayForPrayerSchema = z.object({
  prayerId: z.string().min(1, "Prayer ID is required"),
  prayerOwnerId: z.string().min(1, "Prayer owner ID is required"),
});
