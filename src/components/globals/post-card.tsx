"use client";

import Heart from "@react-sandbox/heart";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "~/hooks/use-toast";
import { User } from "@prisma/client";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { useRef, useState } from "react";
import { api } from "~/trpc/react";
import { Separator } from "~/components/ui/separator";
import { Input } from "../ui/input";

import {
  Bookmark,
  Flag,
  MessageCircleMore,
  MoreVertical,
  SendHorizonal,
  Trash,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Comments } from "./comments";

interface PostCardProps {
  id: number;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  creator: User;
}

export function PostCard({
  title,
  id,
  userId,
  createdAt,
  updatedAt,
  creator,
}: PostCardProps) {
  const [isClick, setClick] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const commentRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: likes } = api.post.getPostLikes.useQuery({ id });
  const { mutate: increaseLikes } = api.post.increaseLikes.useMutation({});
  const { mutate: decreaseLikes } = api.post.decreaseLikes.useMutation();
  const { data: comments } = api.post.getAllComments.useQuery({ postId: id });
  const {
    mutate: deletePost,
    isPending: isPendingDeletePost,
    isError: isErrorDeletePost,
  } = api.post.deletePost.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Post Deleted",
        description: "lorem ipsum",
      });
    },
  });

  const handleReport = () => {};

  const handleToggleComment = async () => {
    setIsOpenComment((prev) => !prev);
    await new Promise((res) => setTimeout(res, 200));
    if (commentRef.current) {
      commentRef.current.focus();
    }
  };

  const onClickLikeHandler = () => {
    if (likes?.some((item) => item.userId === userId)) {
      decreaseLikes({ id });
    } else {
      increaseLikes({ id });
    }
    setClick(!isClick);
  };

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
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">
              {creator.username ?? creator.name}
            </h2>
            <p className="text-sm text-muted-foreground">4 hours ago</p>
          </div>
        </div>

        <div className="">
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
                <span>Report</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              active={likes?.some((item) => item.userId === userId) ?? false}
              onClick={() => setClick(!isClick)}
              inactiveColor="#FFFF"
              strokeWidth={60}
            />
            <h2 className="text-sm font-bold">{likes?.length || 0} Likes</h2>
          </div>

          <div
            onClick={handleToggleComment}
            className="flex cursor-pointer items-center gap-1"
          >
            <MessageCircleMore />
            <h2 className="text-sm font-bold">
              {comments?.length || 0} Comments
            </h2>
          </div>
        </div>

        <div>
          <div className="flex cursor-pointer items-center gap-2">
            <Bookmark />
          </div>
        </div>
      </div>

      {isOpenComment && (
        <Comments postId={id} comments={comments} commentRef={commentRef} />
      )}
    </section>
  );
}
