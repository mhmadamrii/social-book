"use client";

import Heart from "@react-sandbox/heart";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Comments } from "./comments";
import { useRouter } from "next/navigation";
import { toast } from "~/hooks/use-toast";
import { Button } from "../ui/button";
import { cn, getInitial } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { Separator } from "~/components/ui/separator";
import { UserHoverCard } from "./user-hover-card";

import {
  Ban,
  Bookmark,
  Flag,
  MessageCircleMore,
  MoreVertical,
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
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
  isLikedByUser: boolean;
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
  commentsCount,
  likesCount,
  isLikedByUser,
}: PostCardProps) {
  const [isClick, setClick] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [totalLikes, setTotalLikes] = useState(likesCount);

  const commentRef = useRef<HTMLInputElement>(null);
  const utils = api.useUtils();
  const router = useRouter();

  const { mutate: decreaseLikes } = api.post.decreaseLikes.useMutation();
  const { mutate: increaseLikes } = api.post.increaseLikes.useMutation({
    onSuccess: (res) => {
      console.log("success", res);
    },
  });

  const {
    mutate: deletePost,
    isPending: isPendingDeletePost,
    isError: isErrorDeletePost,
  } = api.post.deletePost.useMutation({
    onSuccess: () => {
      utils.post.invalidate();
      toast({
        title: "Post Deleted",
        description: "lorem ipsum",
      });
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
        "mt-1 flex flex-col gap-5 rounded-2xl bg-slate-900 px-4 py-4",
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
            <h2 className="text-[15px] font-bold">
              <UserHoverCard userId={userId} />
              {" · "}
              <span className="text-muted-foreground">@{creator.username}</span>
            </h2>
            <p className="text-[12px] text-muted-foreground">4 hours ago</p>
          </div>
        </div>

        <div className="">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[90px]" align="end">
                <DropdownMenuItem onClick={() => deletePost({ id })}>
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

      <div>
        <p>{title}</p>
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
          <div className="flex cursor-pointer items-center gap-2">
            <Bookmark />
          </div>
        </div>
      </div>

      {isOpenComment && <Comments postId={id} commentRef={commentRef} />}
    </section>
  );
}
