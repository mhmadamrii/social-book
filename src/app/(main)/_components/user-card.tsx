"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { VerifiedIcon } from "~/components/globals/verified-icon";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getInitial } from "~/lib/utils";
import { api } from "~/trpc/react";

export function UserCard({
  user,
  followersCount,
  isAlreadyFollowing,
}: {
  user: any;
  followersCount: number;
  isAlreadyFollowing: boolean;
}) {
  const router = useRouter();
  const utils = api.useUtils();

  const [isFollowed, setIsFollowed] = useState(isAlreadyFollowing);

  const { mutate: follow, isPending } = api.following.followUser.useMutation({
    onSuccess: () => {
      utils.following.invalidate();
      router.refresh();
    },
  });

  const { mutate: unfollow, isPending: isUnfollowing } =
    api.following.unfollowUser.useMutation({
      onSuccess: () => {
        utils.following.invalidate();
        router.refresh();
      },
    });

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user?.image} />
            <AvatarFallback>
              {getInitial(user.username ?? user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <h2 className="flex w-full items-center gap-1 truncate text-sm">
                {user.name ?? user?.username}
                {user?.isVerified && (
                  <span>
                    <VerifiedIcon />
                  </span>
                )}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {followersCount} followers
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <Button
            variant={isFollowed ? "outline" : "default"}
            disabled={isPending || isUnfollowing}
            onClick={() => {
              if (isFollowed) {
                setIsFollowed(false);
                unfollow({
                  userId: user.id,
                });
              } else {
                setIsFollowed(true);
                follow({
                  userId: user.id,
                });
              }
            }}
            className="rounded-xl"
          >
            {isFollowed ? "Unfollow" : "Follow"}
          </Button>
        </div>
      </div>
      <Separator className="w-full" />
    </>
  );
}
