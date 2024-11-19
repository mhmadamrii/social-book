import moment from "moment";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { VerifiedIcon } from "~/components/globals/verified-icon";
import { Suspense } from "react";
import { AnimateLoad } from "~/components/globals/animate-load";
import { CalendarIcon, Users2Icon } from "lucide-react";
import { getInitial } from "~/lib/utils";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { UserDetailPosts } from "../_components/user-detail-posts";
import { FollowUser } from "../_components/follow-user";

export default function User({ params }: { params: { username: string } }) {
  return (
    <section className="flex w-full flex-col gap-4">
      <Suspense fallback={<AnimateLoad />}>
        <UserWithServerData username={params?.username} />
      </Suspense>
      <div className="rounded-2xl bg-slate-500 p-4 dark:bg-slate-900">
        <h1 className="text-center text-3xl font-bold">
          {params?.username}'s posts
        </h1>
      </div>
      <UserDetailPosts username={params?.username} />
    </section>
  );
}

async function UserWithServerData({ username }: { username: string }) {
  const user = await api.auth.getUserByUsername({
    username,
  });

  return (
    <Card className="group mt-1 flex flex-col gap-5 rounded-2xl bg-slate-900 pb-4">
      <div className="relative h-48 rounded-t-2xl bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <CardHeader className="relative px-4 pt-2 sm:px-6">
        <div className="-mt-12 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={user?.image as string} alt="User avatar" />
            <AvatarFallback className="text-5xl font-bold">
              {getInitial(user?.username ?? (user?.name as string))}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <FollowUser user={user} />
        <div className="flex flex-wrap justify-between gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users2Icon className="h-4 w-4" />
            <span className="font-semibold">
              {user?._count.followings}
            </span>{" "}
            followers
          </div>
          <div className="flex items-center gap-1">
            <Users2Icon className="h-4 w-4" />
            <span className="font-semibold">{user?._count.followers}</span>{" "}
            following
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            Joined{" "}
            <span className="font-semibold">
              {moment(user?.createdAt).format("DD MMMM YYYY")}
            </span>
          </div>
        </div>
        {user?.bio ? (
          <p className="text-sm">{user?.bio}</p>
        ) : (
          <p className="text-center text-sm font-thin italic text-muted-foreground">
            The user has not provided a bio yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
