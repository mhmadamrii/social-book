"use client";

import Heart from "@react-sandbox/heart";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Comments } from "./comments";
import { DialogOfferLogin } from "./dialog-offer-login";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { Separator } from "~/components/ui/separator";
import { UserHoverCard } from "./user-hover-card";

import {
  cn,
  extractHashtags,
  getInitial,
  removeHashtags,
  timeAgo,
} from "~/lib/utils";

import {
  Ban,
  Bookmark,
  Flag,
  MessageCircleMore,
  MoreHorizontal,
  Trash,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface PostCardProps {
  id: number;
  title: string;
  userId: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
  imageUrl: string | null;
  isCurrentUserOwnedPost: boolean;
  isBookmarked: boolean;
  blurDataURL?: string;
  session: any;
  creator: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
}

export function PostCard({
  title,
  id,
  userId,
  creator,
  createdAt,
  commentsCount,
  likesCount,
  isLikedByUser,
  imageUrl,
  isCurrentUserOwnedPost,
  isBookmarked,
  session,
}: PostCardProps) {
  const postHashtags = extractHashtags(title);
  const [isOpenDialogOfferLogin, setIsOpenDialogOfferLogin] = useState(false);
  const [isClick, setClick] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [totalLikes, setTotalLikes] = useState(likesCount);

  const commentRef = useRef<HTMLInputElement>(null);
  const utils = api.useUtils();

  const { mutate: decreaseLikes } = api.post.decreaseLikes.useMutation();
  const { mutate: increaseLikes } = api.post.increaseLikes.useMutation();

  const { mutate: createBookmark } = api.bookmark.createBookmark.useMutation({
    onSuccess: (res) => {
      utils.post.invalidate();
      toast.success("Post saved!");
    },
  });

  const { mutate: deleteBookmark } = api.bookmark.deleteBookmark.useMutation({
    onSuccess: (res) => {
      utils.post.invalidate();
      toast.success("Post removed!");
    },
  });

  const {
    mutate: deletePost,
    isPending: isPendingDeletePost,
    isError: isErrorDeletePost,
  } = api.post.deletePost.useMutation({
    onSuccess: () => {
      utils.post.invalidate();
      toast.success("Post deleted!");
    },
  });

  const handleReport = () => {
    console.log("report for post", id);
  };

  const handleToggleComment = async () => {
    setIsOpenComment((prev) => !prev);
    await new Promise((res) => setTimeout(res, 350));
    if (commentRef.current) {
      commentRef.current.focus();
    }
  };

  const onClickLikeHandler = () => {
    if (!session.data) {
      setIsOpenDialogOfferLogin(true);
      return;
    }
    if (isLikedByUser) {
      decreaseLikes({ id: id });
      setTotalLikes((prev) => prev - 1);
    } else {
      setTotalLikes((prev) => prev + 1);
      increaseLikes({ id: id });
    }
    setClick(!isClick);
  };

  useEffect(() => {
    if (isLikedByUser) {
      setClick(true);
    }
  }, [isLikedByUser]);

  return (
    <section
      className={cn(
        "group mt-1 flex flex-col gap-5 rounded-2xl bg-slate-900 px-4 py-4",
        {
          "cursor-not-allowed bg-slate-700 text-gray-500": isPendingDeletePost,
        },
      )}
    >
      <div className="flex items-center">
        <div className="flex w-full items-center gap-2">
          <Avatar>
            <AvatarImage src={creator?.image as string} />
            <AvatarFallback>
              {getInitial(creator?.username ?? (creator?.name as string))}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[15px] font-bold">
              <UserHoverCard
                initialName={creator.name ?? creator.username}
                userId={userId}
              />
              {" · "}
              <span className="text-muted-foreground">@{creator.username}</span>
            </div>
            <p className="text-[12px] text-muted-foreground">
              {timeAgo(createdAt as unknown as string)}
            </p>
          </div>
        </div>

        <div className="">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4 text-white group-hover:text-white sm:text-slate-900" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[90px]" align="end">
                <DropdownMenuItem
                  className={cn("flex items-center gap-2", {
                    hidden: !isCurrentUserOwnedPost,
                  })}
                  onClick={() => deletePost({ id })}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="mr-2 h-4 w-4" />
                  <DialogTrigger>
                    <span>Report</span>
                  </DialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Ban />
                  Report Post
                </DialogTitle>
                <DialogDescription>
                  Report this post if it violates our community guidelines. A{" "}
                  <span className="text-red-500 underline">
                    minimum of 3 reports
                  </span>{" "}
                  is required to review and potentially delete the post.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="items-center">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Reason
                  </Label>
                  <Textarea
                    id="name"
                    defaultValue="Post contains violation of our community guidelines"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleReport} type="submit">
                  Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p>{removeHashtags(title)}</p>
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
          {imageUrl && (
            <Image
              src={imageUrl as string}
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

      <Separator />

      <div className="flex w-full justify-between">
        <div className="flex items-center gap-4">
          <div
            onClick={onClickLikeHandler}
            className="flex cursor-pointer items-center gap-2"
          >
            <Heart
              width={24}
              height={24}
              active={isClick}
              onClick={() => setClick(!isClick)}
              inactiveColor="#FFFF"
              strokeWidth={60}
            />
            <h2 className="text-sm font-bold">{totalLikes || 0} Likes</h2>
          </div>

          <div
            onClick={handleToggleComment}
            className="flex cursor-pointer items-center gap-1"
          >
            <MessageCircleMore className="text-muted-foreground" />
            <h2 className="text-sm font-bold">{commentsCount || 0} Comments</h2>
          </div>
        </div>

        <div>
          <div
            onClick={() => {
              if (isBookmarked) {
                deleteBookmark({
                  postId: id,
                });
              } else {
                createBookmark({
                  postId: id,
                });
              }
            }}
            className="flex cursor-pointer items-center gap-2"
          >
            <Bookmark
              fill={isBookmarked ? "#3b82f6" : "#0f172a"}
              className={cn("text-muted-foreground", {
                "text-blue-500": isBookmarked,
              })}
            />
          </div>
        </div>
      </div>

      {isOpenComment && <Comments postId={id} commentRef={commentRef} />}
      <DialogOfferLogin
        isOpen={isOpenDialogOfferLogin}
        onOpenChange={setIsOpenDialogOfferLogin}
      />
    </section>
  );
}
