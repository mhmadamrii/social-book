import moment from "moment";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getInitial } from "~/lib/utils";
import { VerifiedIcon } from "./verified-icon";
import { CalendarDays } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

interface PeopleYouMayKnowProps {
  image: string | null;
  id: string;
  username: string | null;
  name: string | null;
  bio: string | null;
  isVerified: boolean;
  createdAt: Date;
  _count: {
    followings: number;
    followers: number;
    posts: number;
  };
}
[];

export function PeopleYouMayKnow({ user }: { user: PeopleYouMayKnowProps }) {
  return (
    <HoverCard>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={user?.image as string} />
          <AvatarFallback>
            {getInitial(user?.username ?? (user?.name as string) ?? "")}
          </AvatarFallback>
        </Avatar>
        <HoverCardTrigger className="" asChild>
          <div>
            <div className="flex cursor-pointer items-center gap-1 hover:underline">
              {user.name}
              {user?.isVerified && (
                <span>
                  <VerifiedIcon />
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {user._count.posts} posts
            </span>
          </div>
        </HoverCardTrigger>
      </div>
      <HoverCardContent className="flex w-72 flex-col gap-2">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={user?.image as string} />
            <AvatarFallback>
              {getInitial(user?.username ?? (user?.name as string) ?? "")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <Link
            href={`/u/${user.username}`}
            className="flex w-full cursor-pointer items-center gap-1 truncate text-sm hover:underline"
          >
            {user.name ?? user?.username}
            {user?.isVerified && (
              <span>
                <VerifiedIcon />
              </span>
            )}
          </Link>
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
