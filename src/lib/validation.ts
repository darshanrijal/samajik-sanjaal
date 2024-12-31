import { z } from "zod";

const requiredString = (message?: string) =>
  z.string().min(1, { message }).trim();

export const signUpSchema = z.object({
  email: requiredString("Email is required").email("Invalid email address"),
  username: requiredString("Username is required").regex(
    /^[a-zA-Z0-9_-]{3,20}$/,
    `Username can only contains letters, numbers, "_" and "-" with minimum 3 characters and maximum 20`
  ),
  password: requiredString("You need a password to sign up").min(
    8,
    "Must be at least 8 characters"
  ),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString("Enter your username to login"),
  password: requiredString("Enter your password"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString(),
});
