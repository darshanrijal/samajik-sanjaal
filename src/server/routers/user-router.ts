import type { FollowerInfo } from "@/lib/types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getFollowerInfo: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          followers: {
            where: {
              followerId: ctx.user.id,
            },
            select: {
              followerId: true,
            },
          },
          _count: {
            select: {
              followers: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const data: FollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: !!user.followers.length,
      };

      return data;
    }),

  createFollower: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      await ctx.db.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: ctx.user.id,
            followingId: input.userId,
          },
        },
        create: {
          followerId: ctx.user.id,
          followingId: input.userId,
        },
        update: {},
      });
    }),

  deleteFollower: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      await ctx.db.follow.deleteMany({
        where: {
          followerId: ctx.user.id,
          followingId: input.userId,
        },
      });
    }),
});
