import { getCurrentSession } from "@/auth";
import { db } from "@/lib/prisma";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

export const createTRPCContext = (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async (opts) => {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `You are not authorized to perform this action
      Please login to continue`,
    });
  }

  return opts.next({ ctx: { user } });
});
