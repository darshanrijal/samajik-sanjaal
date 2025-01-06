import {
  createSession,
  generateSessionToken,
  google,
  setSessionTokenCookie,
} from "@/auth";
import { db } from "@/lib/prisma";
import { streamServerClient } from "@/lib/stream";
import type { Claims } from "@/lib/types";
import { decodeIdToken } from "arctic";
import type { OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }
  const claims = decodeIdToken(tokens.idToken()) as Claims;
  const googleUserId = claims.sub;

  const existingUser = await db.user.findUnique({
    where: {
      id: googleUserId,
    },
  });

  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  const user = await db.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        googleId: googleUserId,
        displayName: claims.name,
        username: `${claims.given_name.toLocaleLowerCase()}_${claims.family_name.toLowerCase()}_${crypto.randomUUID().slice(0, 6)}`,
        avatarUrl: claims.picture,
      },
    });
    await streamServerClient.upsertUser({
      id: createdUser.id,
      username: createdUser.username,
      name: createdUser.username,
      image: claims.picture,
    });
    return createdUser;
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
