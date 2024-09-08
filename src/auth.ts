import { Lucia } from "lucia";
import type { User, Session } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "@/lib/prisma";
import { cache } from "react";
import { cookies } from "next/headers";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    /**
     * You can also perform:
     * @param {object} attributes - The object containing the attributes to be returned.
     * @returns {object} - The same object with the attributes.
     * in code -> return {...attributes}
     * However, the lucia documentation suggests doing something like the following:
     */

    return {
      id: attributes.id,
      username: attributes.username,
      displayName: attributes.displayName,
      email: attributes.email,
      googleId: attributes.googleId,
      avatarUrl: attributes.avatarUrl,
      bio: attributes.bio,
      profileCreatedDate: attributes.createdAt,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  googleId: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
}

/**
 * Validates the user request and returns the User and Session data.
 * Wrapped in cache to prevent duplicate requests, storing the result in cache.
 *  - An object containing the User and Session, or `null` for both if validation fails.
 */
export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);
