"use client";

import { VerifiedIcon } from "~/components/globals/verified-icon";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getInitial } from "~/lib/utils";
import { api } from "~/trpc/react";

export function UserCard({ user }: { user: any }) {
  const utils = api.useUtils();

  const { mutate: follow, isPending } = api.following.followUser.useMutation({
    onSuccess: () => {
      utils.following.invalidate();
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
            <h2 className="flex items-center gap-1">
              {user.name ?? ""}
              {user?.isVerified && (
                <span>
                  <VerifiedIcon />
                </span>
              )}
            </h2>
            <p className="text-sm">@{user.username ?? ""}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Button
            disabled={isPending}
            onClick={() =>
              follow({
                userId: user.id,
              })
            }
            className="rounded-xl"
          >
            Follow
          </Button>
        </div>
      </div>
      <Separator className="w-full" />
    </>
  );
}
