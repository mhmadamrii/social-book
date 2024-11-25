"use client";

import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { VerifiedIcon } from "~/components/globals/verified-icon";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn, getInitial } from "~/lib/utils";
import { AvailableUsersType } from "~/server/tRPCtypes";
import { api } from "~/trpc/react";
import { usePathname } from "next/navigation";

type AvailableUserType = AvailableUsersType[number] | null;

export function UserCard({
  user,
  followersCount,
  isAlreadyFollowing,
}: {
  user: AvailableUserType;
  followersCount: number;
  isAlreadyFollowing: boolean;
}) {
  const pathname = usePathname();
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
      <div
        className={cn("flex items-center justify-between", {
          hidden: pathname === `/u/${user?.username}`,
        })}
      >
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user?.image as string} />
            <AvatarFallback>
              {getInitial(user?.username ?? user?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <Link
                href={`/u/${user?.username}`}
                className="flex w-full cursor-pointer items-center gap-1 truncate text-sm hover:underline"
              >
                {user?.name ?? user?.username}
                {user?.isVerified && (
                  <span>
                    <VerifiedIcon />
                  </span>
                )}
              </Link>
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
                  userId: user?.id as string,
                });
              } else {
                setIsFollowed(true);
                follow({
                  userId: user?.id as string,
                });
              }
            }}
            className="rounded-xl"
          >
            {isFollowed ? "Unfollow" : "Follow"}
          </Button>
        </div>
      </div>
      {/* <Separator className="w-full" /> */}
    </>
  );
}
