"use server";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/auth";
import { db } from "@/lib/prisma";
import { type SignUpValues, signUpSchema } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function signUp(
  credentials: SignUpValues
): Promise<{ error: string }> {
  try {
    const { username, email, password } = signUpSchema.parse(credentials);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      parallelism: 1,
      outputLen: 32,
      timeCost: 2,
    });
    const existingUsername = await db.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });
    if (existingUsername) {
      return {
        error: "Username is already taken",
      };
    }
    const existingEmail = await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });
    if (existingEmail) {
      return {
        error: "Email is already taken",
      };
    }
    const newUser = await db.user.create({
      data: {
        username,
        displayName: username,
        email,
        passwordHash,
      },
    });
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, newUser.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
