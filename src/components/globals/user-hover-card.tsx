import moment from "moment";

import { CalendarDays, Plus, PlusIcon } from "lucide-react";
import { VerifiedIcon } from "~/components/globals/verified-icon";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { getInitial } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

export function UserHoverCard({
  userId,
  initialName,
}: {
  userId: string;
  initialName: string | null;
}) {
  const {
    data: user,
    isLoading,
    refetch,
  } = api.auth.getHoveredUser.useQuery(
    {
      userId,
    },
    {
      enabled: false,
    },
  );

  if (isLoading) {
    return <span>Loading..</span>;
  }

  console.log("user", user);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          onMouseEnter={() => refetch()}
          className="flex cursor-pointer items-center gap-1 hover:underline"
        >
          {initialName}
          {user?.isVerified && (
            <span>
              <VerifiedIcon />
            </span>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-72 flex-col gap-2">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={user?.image as string} />
            <AvatarFallback>
              {getInitial(user?.username ?? (user?.name as string) ?? "")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <Button className="flex items-center gap-1 rounded-2xl">
              <PlusIcon />
              Follow
            </Button>
          </div>
        </div>
        <div>
          <h1 className="flex cursor-pointer items-center gap-1">
            <span className="hover:underline">{user?.name}</span>
            {user?.isVerified && (
              <span>
                <VerifiedIcon />
              </span>
            )}
          </h1>
          <span className="text-muted-foreground">@{user?.username}</span>
          <div className="flex items-center gap-2">
            <h1 className="text-sm text-muted-foreground">
              {user?._count.followings} followers
            </h1>
            <h1 className="text-sm text-muted-foreground">
              {user?._count.followers} following
            </h1>
          </div>
          <div>
            {user?.bio ? (
              <p className="text-sm">{user?.bio}</p>
            ) : (
              <p className="text-sm font-thin italic text-muted-foreground">
                The user has not provided a bio yet.
              </p>
            )}
          </div>
          <div className="flex items-center pt-2">
            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-xs text-muted-foreground">
              Joined {moment(user?.createdAt).format("DD MMMM YYYY")}
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
