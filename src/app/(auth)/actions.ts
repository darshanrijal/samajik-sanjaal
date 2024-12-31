"use server";

import {
  deleteSessionTokenCookie,
  invalidateSession,
  validateRequest,
} from "@/auth";
import { redirect } from "next/navigation";
export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await invalidateSession(session.id);
  await deleteSessionTokenCookie();
  return redirect("/login");
}
