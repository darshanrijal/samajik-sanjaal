"use server";

import { signupSchema } from "@/lib/validation";
import { z } from "zod";
import { hash } from "@node-rs/argon2";
import { Cookie, generateIdFromEntropySize } from "lucia";
import { getUserByEmail, getUserByUsername } from "@/data/user";
import prisma from "@/lib/prisma";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function signup(
  credentials: z.infer<typeof signupSchema>,
): Promise<ActionResult> {
  try {
    const { email, username, password } = signupSchema.parse(credentials);
    const [userByEmail, userByUsername] = await Promise.all([
      getUserByEmail(email),
      getUserByUsername(username),
    ]);
    if (userByEmail || userByUsername) {
      return {
        error: "User already exists with those credentials",
      };
    }
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    const userId = generateIdFromEntropySize(10);
    await prisma.user.create({
      data: {
        id: userId,
        email,
        username,
        displayName: username,
        passwordHash,
      },
    });
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error: "Something went wrong, Please try again",
    };
  }
}
