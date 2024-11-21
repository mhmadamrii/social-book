"use client";

import { ArrowRight, Check, MoreHorizontal } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { NotificationsType } from "~/server/tRPCtypes";
import { Link, useTransitionRouter } from "next-view-transitions";
import { Button } from "~/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type _NotificationType = NotificationsType["notifications"][number];

export function NotifMenu({ item }: { item: _NotificationType }) {
  const utils = api.useUtils();
  const router = useTransitionRouter();

  const { mutate: markAsRead } = api.post.markAsRead.useMutation({
    onSuccess: () => {
      toast.success("Marked as read!");
      utils.post.invalidate();
      router.refresh();
    },
  });

  const handleMarkAsRead = () => {
    markAsRead({ id: item.id });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!item.read && (
            <DropdownMenuItem onClick={handleMarkAsRead}>
              <Check className="mr-2 h-4 w-4" />
              <span>Mark as read</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <ArrowRight className="mr-2 h-4 w-4" />
            {item.type === "FOLLOW" ? (
              <Link href={`/u/${item.issuer?.username}`}>Go to user</Link>
            ) : (
              <Link href={`/p/${item.postId}`}>Go to post</Link>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
