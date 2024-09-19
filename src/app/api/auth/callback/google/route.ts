import { google, lucia } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerChat from "@/lib/stream";
import { slugUsername } from "@/lib/utils";
import { GoogleUserInfo } from "@/types";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const storedState = cookies().get("state")?.value;
  const storedCodeVerifier = cookies().get("code_verifier")?.value;

  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    console.log({ code, storedState, storedCodeVerifier, state });
    throw new Error("Invalid request");
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    const userInfoResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user information from Google");
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        googleId: googleUser.sub,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10);
    const username = slugUsername(googleUser.name) + "-" + userId.slice(0, 4);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          googleId: googleUser.sub,
          username,
          displayName: googleUser.name,
        },
      });

      await streamServerChat.upsertUser({
        id: userId,
        username,
        name: username,
      });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    console.error(error);
    return new Response(null, {
      status: 500,
    });
  }
}
