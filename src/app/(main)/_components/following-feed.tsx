"use client";

import Image from "next/image";
import Link from "next/link";

import { Bookmark, ExternalLink, Heart, MessageCircle } from "lucide-react";
import { Comments } from "~/components/globals/comments";
import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { useInView } from "react-intersection-observer";
import { NoPostFound } from "~/components/globals/no-post-found";
import { PostSkeleton } from "~/components/globals/post-skeleton";
import { UserHoverCard } from "~/components/globals/user-hover-card";
import { UserSkeleton } from "~/components/globals/user-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";

import {
  cn,
  extractHashtags,
  getInitial,
  removeHashtags,
  timeAgo,
} from "~/lib/utils";

export function FollowingFeed({ userId }: { userId: any }) {
  const { ref, inView } = useInView();

  const {
    data: followedPosts,
    isFetchingNextPage,
    fetchNextPage,
    isLoading: isInitialLoading,
  } = api.following.getFollowedPosts.useInfiniteQuery(
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

  if (followedPosts?.pages[0]?.followedPosts?.length === 0) {
    return <NoPostFound />;
  }

  return (
    <div className="flex flex-col gap-2">
      {followedPosts?.pages?.map((page, pageIdx) => (
        <div className="flex flex-col gap-2" key={pageIdx}>
          {page?.followedPosts?.map((item) => (
            <PostSection key={item.id} item={item} userId={userId} />
          ))}
        </div>
      ))}
      <div ref={ref} className="h-[10px] sm:h-[50px]"></div>
    </div>
  );
}

function PostSection({ item, userId }: { item: any; userId: string }) {
  const utils = api.useUtils();
  const commentRef = useRef<HTMLInputElement>(null);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [localIsLikedByUser, setLocalIsLikedByUser] = useState(false);

  const { mutate: decreaseLikes } = api.post.decreaseLikes.useMutation({
    onSuccess: () => utils.following.invalidate(),
  });

  const { mutate: increaseLikes } = api.post.increaseLikes.useMutation({
    onSuccess: () => utils.following.invalidate(),
  });

  const onClickLikeHandler = ({
    id,
    isLikedByUser,
  }: {
    id: number;
    isLikedByUser: boolean;
  }) => {
    if (isLikedByUser) {
      setLocalIsLikedByUser(false);
      setTotalLikes((prev) => prev - 1);
      decreaseLikes({ id: id });
    } else {
      setLocalIsLikedByUser(true);
      setTotalLikes((prev) => prev + 1);
      increaseLikes({ id: id });
    }
  };

  const onClickBookmarkHandler = () => {
    return;
  };

  const handleToggleComment = async () => {
    setIsOpenComment((prev) => !prev);
    await new Promise((res) => setTimeout(res, 350));
    if (commentRef.current) {
      commentRef.current.focus();
    }
  };

  const isBookmarked = false;
  const postHashtags = extractHashtags(item.content);
  const isLikedByUser = item.likes.some(
    (like: any) => like.userId === userId ?? false,
  );

  return (
    <div
      className={cn(
        "group mt-1 flex flex-col gap-5 rounded-2xl bg-slate-900 px-4 py-4",
      )}
      key={item.id}
    >
      <div className="flex w-full justify-between">
        <div className="flex w-full items-center gap-2">
          <Avatar>
            <AvatarImage src={item?.user?.image as string} />
            <AvatarFallback>
              {getInitial(item?.user?.username ?? (item?.user?.name as string))}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[15px] font-bold">
              <UserHoverCard
                initialName={item?.user.name ?? item?.user?.username}
                userId={item?.user?.id}
              />
              {" · "}
              <span className="text-muted-foreground">
                @{item?.user?.username}
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground">
              {timeAgo(item?.createdAt as unknown as string)}
            </p>
          </div>
        </div>

        <div>
          <Link href={`/post/${item?.id}`}>
            <ExternalLink className="h-5 w-5 text-muted-foreground hover:text-blue-500" />
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p>{removeHashtags(item?.content)}</p>
        <div className="flex flex-wrap gap-2">
          {postHashtags.map((hashtag, idx) => (
            <span
              key={idx}
              className="cursor-pointer text-blue-500 hover:underline"
            >
              {hashtag}
            </span>
          ))}
        </div>
        <div className="flex w-full items-center justify-center">
          {item?.imageUrl && (
            <Image
              src={item?.imageUrl as string}
              alt="preview"
              width={500}
              height={500}
              className="size-fit max-h-[30rem] rounded-2xl"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg=="
            />
          )}
        </div>
      </div>
      <Separator className="w-full" />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart
              onClick={() =>
                onClickLikeHandler({ id: item?.id, isLikedByUser })
              }
              size={20}
              fill={isLikedByUser ? "#ef4444" : ""}
              className={cn("cursor-pointer text-muted-foreground", {
                "text-red-500": isLikedByUser,
              })}
            />
            <span className="text-sm text-muted-foreground">
              {item?.likes.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MessageCircle
              onClick={handleToggleComment}
              size={20}
              className={cn("cursor-pointer text-muted-foreground")}
            />
            <span className="text-sm text-muted-foreground">{0}</span>
          </div>
        </div>

        <div>
          <div
            onClick={() => onClickBookmarkHandler()}
            className="flex cursor-pointer items-center gap-2"
          >
            <Bookmark
              size={20}
              fill={isBookmarked ? "#3b82f6" : "#0f172a"}
              className={cn("text-muted-foreground", {
                "text-blue-500": isBookmarked,
              })}
            />
          </div>
        </div>
      </div>
      {isOpenComment && <Comments postId={item.id} commentRef={commentRef} />}
    </div>
  );
}
