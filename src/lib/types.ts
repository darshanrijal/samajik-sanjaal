import type { SessionValidationResult } from "@/auth";

export type SessionUser = NonNullable<SessionValidationResult["user"]>;
export type DBSession = NonNullable<SessionValidationResult["session"]>;
