"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { VerifiedIcon } from "~/components/globals/verified-icon";
import { Button } from "~/components/ui/button";
import { GetCurrentUserType, GetUserByUsernameType } from "~/server/tRPCtypes";
import { api } from "~/trpc/react";

export function FollowUser({
  user,
  currentUser,
}: {
  user: GetUserByUsernameType;
  currentUser: GetCurrentUserType;
}) {
  const session = useSession();
  const router = useRouter();
  const utils = api.useUtils();

  const [isFollowed, setIsFollowed] = useState(false);

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
    <div className="flex justify-between">
      <div className="mt-2 space-y-1 text-center sm:mt-0 sm:text-left">
        <h2 className="flex items-center gap-1 text-xl font-bold">
          {user?.name}
          {user?.isVerified && (
            <span>
              <VerifiedIcon />
            </span>
          )}
        </h2>
        <p className="text-sm text-muted-foreground">@{user?.username}</p>
      </div>
      <Button
        onClick={() => {
          if (!session.data) {
            return;
          }
          if (isFollowed) {
            setIsFollowed(false);
            unfollow({
              userId: user!.id,
            });
          } else {
            setIsFollowed(true);
            follow({
              userId: user?.id as string,
            });
          }
        }}
        variant={isFollowed ? "outline" : "default"}
        className="ml-auto mt-2 sm:mt-0"
      >
        {isFollowed ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
}
