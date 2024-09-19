"use server";

import { getUserByUsername } from "@/data/user";
import { loginSchema } from "@/lib/validation";
import {
  isRedirectError,
  redirect,
} from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2";
import { z } from "zod";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { ActionResult } from "@/types";

export async function login(
  credentials: z.infer<typeof loginSchema>,
): Promise<ActionResult> {
  try {
    const { username, password } = loginSchema.parse(credentials);
    const userByUsername = await getUserByUsername(username);
    if (!userByUsername || !userByUsername.passwordHash) {
      return { error: "Incorrect username or password" };
    }
    const validPassword = await verify(userByUsername.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return { error: "Invalid username or password" };
    }
    const session = await lucia.createSession(userByUsername.id, {});
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
    return { error: "Something went wrong, Please try again" };
  }
}
