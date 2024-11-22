"use client";

import Image from "next/image";

import { UserHoverCard } from "~/components/globals/user-hover-card";
import { PostDetaiByIdType } from "~/server/tRPCtypes";
import { Comments } from "~/components/globals/comments";
import { api } from "~/trpc/react";
import { CommentDetailCard } from "./comment-detail-card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { useRef, useState } from "react";
import { Separator } from "~/components/ui/separator";
import { useSession } from "next-auth/react";
import { DialogOfferLogin } from "~/components/globals/dialog-offer-login";
import { toast } from "sonner";

import {
  Ban,
  Bookmark,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Trash,
} from "lucide-react";

import {
  cn,
  extractHashtags,
  getInitial,
  removeHashtags,
  timeAgo,
} from "~/lib/utils";

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
  DialogTrigger,
} from "~/components/ui/dialog";

export function PostDetailCard({ post }: { post: PostDetaiByIdType }) {
  const session = useSession();

  return (
    <>
      <section className="group mt-1 flex flex-col gap-5 rounded-2xl bg-slate-900 px-4 py-4">
        <PostHeader creator={post?.user} createdAt={post?.createdAt} />
        <PostContent imageUrl={post!.imageUrl} title={post!.content} />
        <Separator />
        <PostFooter post={post} session={session} />
      </section>
      <section className="rounded-2xl bg-slate-900 px-4 py-4">
        <h1 className="text-center text-3xl font-bold">Comments</h1>
      </section>

      <CommentDetailCard post={post} />
    </>
  );
}

const PostHeader = ({
  creator,
  createdAt,
}: {
  creator: any;
  createdAt: any;
}) => {
  const handleReport = () => {
    return;
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
              userId={creator?.id}
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
              <DropdownMenuItem className={cn("flex items-center gap-2", {})}>
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

const PostFooter = ({ post, session }: { post: any; session: any }) => {
  const utils = api.useUtils();
  const commentRef = useRef<HTMLInputElement>(null);

  const [isBookmarked, setIsBookmarked] = useState(
    post?.bookmarks?.some(
      (b: any) => b.userId === session?.data?.user?.id ?? false,
    ) ?? false,
  );
  const [totalLikes, setTotalLikes] = useState<number>(
    post?._count?.likes ?? 0,
  );
  const [isClick, setClick] = useState(
    post?.likes.some(
      (like: any) => like.userId === session?.data?.user?.id ?? false,
    ),
  );
  const [isOpenDialogOfferLogin, setIsOpenDialogOfferLogin] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);

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

  const onClickLikeHandler = () => {
    if (!session.data) {
      setIsOpenDialogOfferLogin(true);
      return;
    }
    setClick(!isClick);
    if (isClick) {
      setTotalLikes((prev) => prev - 1);
      decreaseLikes({ id: post.id });
    } else {
      setTotalLikes((prev) => prev + 1);
      increaseLikes({ id: post.id, postAuthor: post?.user?.id });
    }
  };

  const onClickCommentHandler = () => {
    if (!session.data) {
      setIsOpenDialogOfferLogin(true);
      return;
    }
    setIsOpenComment(!isOpenComment);
  };

  const onClickBookmarkHandler = () => {
    if (!session.data) {
      setIsOpenDialogOfferLogin(true);
      return;
    }
    setIsBookmarked((prev: boolean) => !prev);
    if (isBookmarked) {
      deleteBookmark({
        postId: post.id,
      });
    } else {
      createBookmark({
        postId: post.id,
      });
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart
              onClick={onClickLikeHandler}
              size={20}
              fill={isClick ? "#ef4444" : "#0f172a"}
              className={cn("cursor-pointer text-muted-foreground", {
                "text-red-500": isClick,
              })}
            />
            <span className="text-sm text-muted-foreground">{totalLikes}</span>
          </div>

          <div className="flex items-center gap-2">
            <MessageCircle
              onClick={onClickCommentHandler}
              size={20}
              className={cn("cursor-pointer text-muted-foreground")}
            />
            <span className="text-sm text-muted-foreground">
              {post?._count?.comments}
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

        <DialogOfferLogin
          isOpen={isOpenDialogOfferLogin}
          onOpenChange={setIsOpenDialogOfferLogin}
          message="You will be redirected to this post after login"
          redirectUri={`/p/${post?.id}`}
        />
      </div>
      {isOpenComment && (
        <Comments
          postId={post?.id}
          creator={post?.user}
          commentRef={commentRef}
          withoutCommentList
        />
      )}
    </>
  );
};
