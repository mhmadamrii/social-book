import Link from "next/link";

import { Button } from "~/components/ui/button";
import { timeAgo } from "~/lib/utils";
import { VerifiedIcon } from "~/components/globals/verified-icon";
import { Separator } from "~/components/ui/separator";
import { Suspense } from "react";
import { AnimateLoad } from "~/components/globals/animate-load";
import { NoNotificationFound } from "~/components/globals/no-notification-found";
import { api } from "~/trpc/server";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import {
  Heart,
  MessageCircle,
  UserPlus,
  MoreHorizontal,
  Check,
  ArrowRight,
} from "lucide-react";

type NotificationType = "LIKE" | "COMMENT" | "FOLLOW";

const getIcon = (type: NotificationType) => {
  switch (type) {
    case "LIKE":
      return <Heart className="h-8 w-8 text-red-500" />;
    case "COMMENT":
      return <MessageCircle className="h-8 w-8 text-blue-500" />;
    case "FOLLOW":
      return <UserPlus className="h-8 w-8 text-green-500" />;
  }
};

export default function Notifications() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="rounded-2xl bg-slate-900 p-4">
        <h1 className="text-center text-3xl font-bold">Notifications</h1>
      </div>
      <Suspense fallback={<AnimateLoad />}>
        <NotificationsServerData />
      </Suspense>
    </div>
  );
}

async function NotificationsServerData() {
  const notifications = await api.post.getMyNotifications();

  if (notifications.notifications.length === 0) {
    return <NoNotificationFound />;
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl bg-slate-900 p-4">
      {notifications.notifications.map((item) => (
        <div
          key={item.id}
          className="my-4 flex w-full flex-col justify-center gap-4 rounded-xl"
        >
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">{getIcon(item.type)}</div>
              <div>
                <h1 className="flex items-center gap-1 text-lg">
                  {item.issuer?.name}{" "}
                  {item.issuer?.isVerified && (
                    <span>
                      <VerifiedIcon />
                    </span>
                  )}
                  <span className="lowercase">
                    {item.type}s{" "}
                    {item.type === "FOLLOW" ? "your account" : "your"}{" "}
                    {item.type === "FOLLOW" ? "" : "post"}
                  </span>
                </h1>
                <p className="text-[12px] text-muted-foreground">
                  {timeAgo(item?.createdAt as unknown as string)}
                </p>
              </div>
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!item.read && (
                    <DropdownMenuItem>
                      <Check className="mr-2 h-4 w-4" />
                      <span>Mark as read</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    <span>Go to post</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Separator />
        </div>
      ))}
    </div>
  );
}
