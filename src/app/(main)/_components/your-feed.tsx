"use client";

import { PostCard } from "~/components/globals/post-card";
import { api } from "~/trpc/react";
import { useInView } from "react-intersection-observer";
import { PostSkeleton } from "~/components/globals/post-skeleton";
import { useEffect } from "react";
import { NoPostFound } from "~/components/globals/no-post-found";

export function YourFeed({ userId }: { userId: string | undefined }) {
  const { ref, inView } = useInView();

  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isLoading: isInitialLoading,
  } = api.post.getAllInfinitePosts.useInfiniteQuery(
    {
      limit: 2,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor || null,
    },
  );

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetchingNextPage, fetchNextPage]);

  if (isInitialLoading) {
    return <PostSkeleton count={3} />;
  }

  if (data?.pages[0]?.posts.length === 0) {
    return <NoPostFound />;
  }

  console.log("is has next", hasNextPage);

  return (
    <div className="flex flex-col gap-4">
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="flex flex-col gap-4">
          {page?.posts?.map((item) => (
            <PostCard
              key={item.id}
              createdAt={item.createdAt}
              userId={item.userId}
              id={item.id}
              title={item.content}
              likesCount={item._count.likes}
              commentsCount={item._count.comments}
              creator={item.user}
              imageUrl={item.imageUrl}
              isLikedByUser={item.likes.some(
                (like) => like.userId === userId ?? false,
              )}
              isCurrentUserOwnedPost={item.userId === userId ?? false}
            />
          ))}
        </div>
      ))}
      {isFetchingNextPage && <PostSkeleton count={3} />}
      <div ref={ref} className="h-[50px]"></div>
    </div>
  );
}
