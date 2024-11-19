import moment from "moment";
import { Link } from "next-view-transitions";

import { CalendarDays, Plus, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { VerifiedIcon } from "~/components/globals/verified-icon";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { cn, getInitial } from "~/lib/utils";
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
  const router = useRouter();
  const session = useSession();
  const utils = api.useUtils();
  const [isFollowed, setIsFollowed] = useState(false);

  const { mutate: follow, isPending } = api.following.followUser.useMutation({
    onSuccess: async () => {
      router.refresh();
      utils.following.invalidate();
      utils.auth.invalidate();
    },
  });

  const { mutate: unfollow } = api.following.unfollowUser.useMutation({
    onSuccess: () => {
      router.refresh();
      utils.following.invalidate();
      utils.auth.invalidate();
    },
  });

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

  const onClickFollowHandler = () => {
    if (isFollowed) {
      setIsFollowed(false);
      unfollow({
        userId: userId,
      });
    } else {
      setIsFollowed(true);
      follow({
        userId: userId,
      });
    }
  };

  useEffect(() => {
    if (user) {
      const isAlreadyFollowings = user?.followings.some(
        (u) => u.followingId === userId,
      );
      setIsFollowed(isAlreadyFollowings);
    } else {
      return;
    }
  }, [user]);

  if (isLoading) {
    return <span>Loading..</span>;
  }

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
          <div
            className={cn("space-y-1", {
              hidden: !session.data,
            })}
          >
            <Button
              variant={isFollowed ? "outline" : "default"}
              className="flex items-center gap-1 rounded-2xl"
              onClick={onClickFollowHandler}
            >
              {!isFollowed && <PlusIcon />}
              {isFollowed ? "Unfollow" : "Follow"}
            </Button>
          </div>
        </div>
        <div>
          <h1 className="flex cursor-pointer items-center gap-1">
            <Link href={`/u/${user?.username}`} className="hover:underline">
              {user?.name}
            </Link>
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
