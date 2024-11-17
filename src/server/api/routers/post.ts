import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAllPosts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }),

  getPostsByHashtag: publicProcedure
    .input(z.object({ hashtag: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findMany({
        where: {
          content: {
            contains: input.hashtag,
          },
        },
      });
    }),

  getAllInfinitePosts: publicProcedure
    .input(z.object({ limit: z.number(), cursor: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit || 3;
      const cursor = input.cursor; // Cursor from the previous request

      const posts = await ctx.db.post.findMany({
        take: limit + 1, // Fetch one extra item to determine if there's a next page
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" }, // Adjust based on your needs
        include: {
          user: true,
          likes: {
            select: {
              userId: true,
            },
          },
          bookmarks: {
            select: {
              id: true,
              userId: true,
            },
          },
          comments: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
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

  create: protectedProcedure
    .input(
      z.object({ content: z.string().min(1), imageUrl: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          content: input.content,
          imageUrl: input.imageUrl ?? null,
        },
      });
    }),

  deletePost: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({
        where: {
          id: input.id,
        },
      });
    }),

  increaseLikes: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.like.create({
        data: {
          postId: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  decreaseLikes: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.like.deleteMany({
        where: {
          postId: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  getPostLikes: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.like.findMany({
        where: {
          postId: input.id,
        },
      });
    }),

  getAllComments: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          user: true,
        },
      });
    }),

  createComment: protectedProcedure
    .input(z.object({ id: z.number(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          postId: input.id,
          userId: ctx.session.user.id,
          content: input.content,
        },
      });
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
