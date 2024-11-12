import { z } from "zod";
import { extractHashtags } from "~/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const trendingRouter = createTRPCRouter({
  getAllTrendings: publicProcedure.query(async ({ ctx }) => {
    const postsWithHashtags = await ctx.db.post.findMany({
      select: {
        content: true,
      },
      where: {
        content: {
          contains: "#",
        },
      },
    });

    if (postsWithHashtags.length > 0) {
      const allHashtags = postsWithHashtags.flatMap((item) => {
        return extractHashtags(item.content);
      });

      const hashtagCounts = allHashtags.reduce((acc: any, hashtag: any) => {
        acc[hashtag] = (acc[hashtag] || 0) + 1;
        return acc;
      }, {});

      const hashtagArray = Object.entries(hashtagCounts).map(
        ([hashtag, count]) => ({
          hashtag,
          count,
        }),
      );
      const sortedHashtags = hashtagArray.sort(
        (a: any, b: any) => b.count - a.count,
      );
      return sortedHashtags;
    } else {
      return [];
    }
  }),

  createTrending: protectedProcedure
    .input(z.object({ content: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const data = input.content.map((item) => ({
        content: item,
      }));

      return ctx.db.trendingTopic.createMany({
        data,
      });
    }),
});
