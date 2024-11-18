"use client";

import { PostCard } from "~/components/globals/post-card";
import { api } from "~/trpc/react";
import { useInView } from "react-intersection-observer";
import { PostSkeleton } from "~/components/globals/post-skeleton";
import { useEffect } from "react";
import { NoPostFound } from "~/components/globals/no-post-found";
import { useSession } from "next-auth/react";

export function UserDetailPosts({ username }: { username: string }) {
  const { ref, inView } = useInView();
  const session = useSession();

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    isLoading: isInitialLoading,
  } = api.post.getAllInfinitePostsByUsername.useInfiniteQuery(
    {
      limit: 2,
      username: username,
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
    return <NoPostFound message="No posts found for this user." />;
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="flex flex-col gap-4">
          {page?.posts?.map((item) => {
            return (
              <PostCard
                session={session}
                key={item.id}
                createdAt={item.createdAt}
                userId={item.userId}
                id={item.id}
                title={item.content}
                likesCount={item._count.likes}
                commentsCount={item._count.comments}
                creator={item.user}
                imageUrl={item.imageUrl}
                isBookmarked={
                  item.bookmarks.some(
                    (b) => b.userId === session?.data?.user.id,
                  ) ?? false
                }
                isLikedByUser={item.likes.some(
                  (like) => like.userId === session?.data?.user.id ?? false,
                )}
                isCurrentUserOwnedPost={
                  item.userId === session?.data?.user.id ?? false
                }
              />
            );
          })}
        </div>
      ))}
      {isFetchingNextPage && <PostSkeleton count={3} />}
      <div ref={ref} className="h-[10px] sm:h-[50px]"></div>
    </div>
  );
}
