"use client";

import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useTransitionRouter } from "next-view-transitions";
import { Comments } from "./comments";
import { DialogOfferLogin } from "./dialog-offer-login";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useEffect, useRef, useState, useOptimistic } from "react";
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
  Heart,
  MoreHorizontal,
  Trash,
  MessageCircle,
  ExternalLink,
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
  const commentRef = useRef<HTMLInputElement>(null);
  const utils = api.useUtils();

  const [isOpenDialogOfferLogin, setIsOpenDialogOfferLogin] = useState(false);
  const [isClick, setClick] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [totalLikes, setTotalLikes] = useState(likesCount);
  const [localIsLikedByUser, setLocalIsLikedByUser] = useState(isLikedByUser);

  const { mutate: decreaseLikes } = api.post.decreaseLikes.useMutation({
    onSuccess: () => utils.post.invalidate(),
  });

  const { mutate: increaseLikes } = api.post.increaseLikes.useMutation({
    onSuccess: () => utils.post.invalidate(),
  });

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

  const handleToggleComment = async () => {
    if (!session.data) {
      setIsOpenDialogOfferLogin(true);
      return;
    }

    setIsOpenComment((prev) => !prev);
    await new Promise((res) => setTimeout(res, 350));
    if (commentRef.current) {
      commentRef.current.focus();
    }
  };

  const onClickLikeHandler = () => {
    setClick(!isClick);
    if (!session.data) {
      setIsOpenDialogOfferLogin(true);
      return;
    }

    if (isLikedByUser) {
      setLocalIsLikedByUser(false);
      setTotalLikes((prev) => prev - 1);
      decreaseLikes({ id: id });
    } else {
      setLocalIsLikedByUser(true);
      setTotalLikes((prev) => prev + 1);
      increaseLikes({ id: id, postAuthor: creator.id });
    }
  };

  const onClickBookmarkHandler = () => {
    if (!session.data) {
      setIsOpenDialogOfferLogin(true);
      return;
    }
    if (isBookmarked) {
      deleteBookmark({
        postId: id,
      });
    } else {
      createBookmark({
        postId: id,
      });
    }
  };

  useEffect(() => {
    if (isLikedByUser) {
      setClick(true);
    }
  }, [isLikedByUser]);

  return (
    <section className="group mt-1 flex flex-col gap-5 rounded-2xl bg-slate-900 px-4 py-4">
      <PostHeader
        createdAt={createdAt}
        creator={creator}
        userId={userId}
        id={id}
        isCurrentUserOwnedPost={isCurrentUserOwnedPost}
      />
      <PostContent imageUrl={imageUrl} title={title} />
      <Separator />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart
              onClick={onClickLikeHandler}
              size={20}
              fill={localIsLikedByUser ? "#ef4444" : "#0f172a"}
              className={cn("cursor-pointer text-muted-foreground", {
                "text-red-500": localIsLikedByUser,
              })}
            />
            <span className="text-sm text-muted-foreground">{totalLikes}</span>
          </div>

          <div className="flex items-center gap-2">
            <MessageCircle
              onClick={handleToggleComment}
              size={20}
              className={cn("cursor-pointer text-muted-foreground")}
            />
            <span className="text-sm text-muted-foreground">
              {commentsCount}
            </span>
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
      {isOpenComment && (
        <Comments postId={id} creator={creator} commentRef={commentRef} />
      )}
      <DialogOfferLogin
        isOpen={isOpenDialogOfferLogin}
        onOpenChange={setIsOpenDialogOfferLogin}
      />
    </section>
  );
}

const PostHeader = ({
  creator,
  userId,
  createdAt,
  isCurrentUserOwnedPost,
  id,
}: {
  creator: any;
  userId: string;
  createdAt: Date;
  isCurrentUserOwnedPost: boolean;
  id: number;
}) => {
  const utils = api.useUtils();
  const router = useTransitionRouter();

  const { mutate } = api.post.deletePost.useMutation({
    onSuccess: () => {
      utils.post.invalidate();
      toast.success("Post deleted!");
    },
  });

  const handleReport = () => {
    console.log("report for post", id);
  };

  return (
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
      <div>
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
                onClick={() => mutate({ id })}
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
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/p/${id}`);
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                <DialogTrigger>
                  <span>Detail</span>
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
  );
};

const PostContent = ({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string | null;
}) => {
  const postHashtags = extractHashtags(title);

  return (
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
  );
};
