"use server";

import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/auth";
import { redirect } from "next/navigation";
export async function logout() {
  const { session } = await getCurrentSession();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await invalidateSession(session.id);
  await deleteSessionTokenCookie();
  return redirect("/login");
}
