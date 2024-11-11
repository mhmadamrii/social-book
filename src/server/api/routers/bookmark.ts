import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const bookmarkRouter = createTRPCRouter({
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
});
