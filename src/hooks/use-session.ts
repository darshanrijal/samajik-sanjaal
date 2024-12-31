import { sessionContext } from "@/app/(main)/session-provider";
import { useContext } from "react";

export function useSession() {
  const ctx = useContext(sessionContext);
  if (!ctx) {
    throw new Error("useSession must be used inside <SessionProvider/>");
  }
  return ctx;
}
