"use server";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/auth";
import { db } from "@/lib/prisma";
import { type LoginValues, loginSchema } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function login(
  credentials: LoginValues
): Promise<{ error: string }> {
  try {
    const { username, password } = loginSchema.parse(credentials);
    const existingUser = await db.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });
    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Incorrect username or password",
      };
    }
    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      parallelism: 1,
      outputLen: 32,
      timeCost: 2,
    });
    if (!validPassword) {
      return {
        error: "Incorrect username or password",
      };
    }
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
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
