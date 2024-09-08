/**
 * @file SessionProvider.tsx
 * This file contains the implementation of the SessionProvider component using Lucia for session management.
 * It provides session and user context to the children components in a Next.js application.
 */

"use client";

import { Session, User } from "lucia";
import { createContext, PropsWithChildren, useContext } from "react";

interface SessionContext {
  /**
   * Represents the current session object containing session information.
   * @type {Session}
   */
  session: Session;

  /**
   * Represents the current user object containing user information.
   * @type {User}
   */
  user: User;
}

/**
 * Creates a context to hold the session and user data.
 * @type {React.Context<SessionContext | null>}
 */
const sessionContext = createContext<SessionContext | null>(null);

/**
 * SessionProvider Component
 * Wraps its children with the session context, allowing child components to access the session and user data.
 *
 * @param {PropsWithChildren<{ session: SessionContext }>} props - The props containing session data and child components.
 * @param {SessionContext} props.session - The session and user data to be provided to the context.
 * @param {ReactNode} props.children - The child components that need access to the session context.
 *
 * @returns {JSX.Element} The context provider wrapping the children components.
 *
 * @example
 * // Usage in a Next.js component:
 * <SessionProvider session={{ session, user }}>
 *   <YourComponent />
 * </SessionProvider>
 */
export const SessionProvider = ({
  children,
  session,
}: PropsWithChildren<{ session: SessionContext }>) => {
  return (
    <sessionContext.Provider value={session}>
      {children}
    </sessionContext.Provider>
  );
};

/**
 * Custom hook to access session and user data from the session context.
 * Throws an error if used outside of a SessionProvider.
 *
 * @returns {SessionContext} The current session and user data.
 *
 * @throws {Error} If the hook is used outside of a SessionProvider.
 *
 * @example
 * // Usage in a component:
 * const { session, user } = useSession();
 * console.log(session, user);
 */
export function useSession() {
  const session = useContext(sessionContext);

  if (!session) {
    throw new Error(
      "useSession must be wrapped (or used) inside SessionProvider",
    );
  }

  return session;
}
