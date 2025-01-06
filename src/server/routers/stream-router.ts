import { streamServerClient } from "@/lib/stream";
import { protectedProcedure, router } from "../trpc";

export const streamRouter = router({
  getToken: protectedProcedure.query(({ ctx }) => {
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamServerClient.createToken(
      ctx.user.id,
      expirationTime,
      issuedAt
    );

    return {
      token,
    };
  }),

  getStreamUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const { total_unread_count } = await streamServerClient.getUnreadCount(
      ctx.user.id
    );

    return { unreadCount: total_unread_count };
  }),
});
