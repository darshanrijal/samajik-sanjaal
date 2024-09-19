import { github, lucia } from "@/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/prisma";
import streamServerChat from "@/lib/stream";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid or missing OAuth state",
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    if (!githubUserResponse.ok) {
      return new Response(null, {
        status: githubUserResponse.status,
        statusText: "Failed to fetch GitHub user",
      });
    }

    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        githubId: githubUser.id,
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

    const userId = generateIdFromEntropySize(10); // Adjust entropy size for desired length

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          githubId: githubUser.id,
          username: githubUser.login,
          displayName: githubUser.login,
        },
      });
      await streamServerChat.upsertUser({
        id: userId,
        username: githubUser.login,
        name: githubUser.login,
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
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
        statusText: "OAuth2 Request Error",
      });
    }
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

interface GitHubUser {
  id: number;
  login: string;
  // Add other fields as needed based on the GitHub API response
}
