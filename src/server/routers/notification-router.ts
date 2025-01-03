import { notificationsInclude } from "@/lib/types";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const notificationRouter = router({
  getNotifications: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;
      const pagesize = 10;

      const notifications = await ctx.db.notification.findMany({
        where: {
          recipientId: ctx.user.id,
        },
        include: notificationsInclude,
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        take: pagesize + 1,
      });

      const nextCursor =
        notifications.length > pagesize ? notifications[pagesize].id : null;

      return {
        notifications: notifications.slice(0, pagesize),
        nextCursor,
      };
    }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.notification.count({
      where: {
        recipientId: ctx.user.id,
        read: false,
      },
    });

    return {
      unreadCount: count,
    };
  }),

  markAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.notification.updateMany({
      where: {
        recipientId: ctx.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }),
});
