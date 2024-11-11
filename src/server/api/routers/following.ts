import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const followingRouter = createTRPCRouter({
  getAllPosts: protectedProcedure
    .input(z.object({ limit: z.number(), cursor: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit || 3;
      const cursor = input.cursor; // Cursor from the previous request

      const posts = await ctx.db.post.findMany({
        take: limit + 1, // Fetch one extra item to determine if there's a next page
        skip: cursor ? 1 : 0, // Skip the cursor if present
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" }, // Adjust based on your needs
      });

      let nextCursor = null;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  followUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.follow.create({
        data: {
          followingId: ctx.session.user.id, // The current user (follower)
          followerId: input.userId, // The user being followed
        },
      });
    }),

  getAvailableFollows: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      where: {
        id: {
          not: ctx.session.user.id,
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        isVerified: true,
      },
    });

    const follows = await ctx.db.follow.findMany({
      where: {
        followingId: ctx.session.user.id,
      },
    });

    const availableUsers = users.filter((user) => {
      return !follows.some((follow) => follow.followerId === user.id);
    });

    return availableUsers;
  }),
});
