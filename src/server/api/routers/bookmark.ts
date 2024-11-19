import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const bookmarkRouter = createTRPCRouter({
  createBookmark: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const bookmark = await ctx.db.bookmark.create({
        data: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });

      return bookmark;
    }),

  deleteBookmark: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.bookmark.deleteMany({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
    }),

  getAllUserBookmark: protectedProcedure.query(async ({ ctx }) => {
    const bookmarks = await ctx.db.bookmark.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        post: {
          include: {
            user: true,
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
        user: true,
      },
    });

    return bookmarks;
  }),
});
