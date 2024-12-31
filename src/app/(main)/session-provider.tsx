"use client";

import type { DBSession, SessionUser } from "@/lib/types";
import { type PropsWithChildren, createContext } from "react";

interface SessionContext {
  user: SessionUser;
  session: DBSession;
}

export const sessionContext = createContext<SessionContext | null>(null);

export const SessionProvider = ({
  session,
  children,
}: PropsWithChildren<{ session: SessionContext }>) => {
  return (
    <sessionContext.Provider value={session}>
      {children}
    </sessionContext.Provider>
  );
};
