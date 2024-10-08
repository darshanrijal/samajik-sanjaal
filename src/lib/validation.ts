import { z } from "zod";

const requiredString = (message?: string) => z.string().min(1, { message });

export const signupSchema = z.object({
  email: requiredString("Please provide your email")
    .email({ message: "Invalid email address" })
    .trim(),
  username: requiredString("Username is required for login later on").regex(
    /^[a-zA-Z0-9_-]+$/,
    {
      message:
        "Username can only contain number, letters and special symbols  '-' and '_'",
    },
  ),
  password: requiredString("Please provide a password").min(
    8,
    "Password must be atleast 8 characters",
  ),
});

export const loginSchema = z.object({
  username: requiredString("Enter your username to login"),
  password: requiredString("Enter your password"),
});

export const createPostSchema = z.object({
  content: requiredString(),
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString("Display name is required"),
  bio: z.string().max(1000, "Must be at most 1000 characters"),
});

export const createCommentSchema = z.object({
  content: requiredString(),
});
