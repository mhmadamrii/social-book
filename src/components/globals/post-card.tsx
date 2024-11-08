"use client";

import Heart from "@react-sandbox/heart";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "../ui/button";
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

export function PostCard({ title }: { title: any }) {
  const [isClick, setClick] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [comment, setComment] = useState("");
  const commentRef = useRef<HTMLInputElement>(null);

  const handleDelete = () => {};

  const handleReport = () => {};

  const handleToggleComment = async () => {
    setIsOpenComment((prev) => !prev);
    await new Promise((res) => setTimeout(res, 200));
    if (commentRef.current) {
      commentRef.current.focus();
    }
  };

  return (
    <section className="mt-1 flex flex-col gap-5 rounded-2xl bg-slate-900 px-4 py-4">
      <div className="flex items-center">
        <div className="flex w-full items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">hellow</h2>
            <p className="text-sm text-muted-foreground">4 hours ago</p>
          </div>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[90px]" align="end">
              <DropdownMenuItem onClick={handleDelete}>
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
          <div className="flex cursor-pointer items-center gap-2">
            <Heart
              width={24}
              height={24}
              active={isClick}
              onClick={() => setClick(!isClick)}
              inactiveColor="#FFFF"
              strokeWidth={60}
            />
            <h2 className="text-sm font-bold">0 Likes</h2>
          </div>

          <div
            onClick={handleToggleComment}
            className="flex cursor-pointer items-center gap-1"
          >
            <MessageCircleMore />
            <h2 className="text-sm font-bold">0 Comments</h2>
          </div>
        </div>

        <div>
          <div className="flex cursor-pointer items-center gap-2">
            <Bookmark />
          </div>
        </div>
      </div>

      {isOpenComment && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2">
            <Input
              ref={commentRef}
              placeholder="Write a comment..."
              className="w-full"
            />
            <Button className="h-[40px] w-[40px]" variant="ghost">
              <SendHorizonal />
            </Button>
          </div>

          <h2 className="text-center">No comment yet.</h2>
        </section>
      )}
    </section>
  );
}
