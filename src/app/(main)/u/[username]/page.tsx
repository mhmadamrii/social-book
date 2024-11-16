import moment from "moment";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { VerifiedIcon } from "~/components/globals/verified-icon";
import { Suspense } from "react";
import { AnimateLoad } from "~/components/globals/animate-load";
import { CalendarIcon, Users2Icon } from "lucide-react";
import { getInitial } from "~/lib/utils";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

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
    </section>
  );
}

async function UserWithServerData({ username }: { username: string }) {
  const user = await api.auth.getUserByUsername({
    username,
  });

  return (
    <Card className="group mt-1 flex flex-col gap-5 rounded-2xl bg-slate-900 pb-4">
      <div className="relative h-48 rounded-t-2xl bg-gradient-to-r from-blue-500 to-purple-500">
        {/* <Image
          src="/bg-placeholder.jpg"
          alt="Profile background"
          className="h-full w-full object-cover"
          width={100}
          height={100}
        /> */}
      </div>
      <CardHeader className="relative px-4 pt-2 sm:px-6">
        <div className="-mt-12 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage
              src="/placeholder.svg?height=96&width=96"
              alt="User avatar"
            />
            <AvatarFallback className="text-5xl font-bold">
              {getInitial(user?.username ?? (user?.name as string))}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="flex justify-between">
          <div className="mt-2 space-y-1 text-center sm:mt-0 sm:text-left">
            <h2 className="flex items-center gap-1 text-xl font-bold">
              {user?.name}
              {!user?.isVerified && (
                <span>
                  <VerifiedIcon />
                </span>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>
          </div>
          <Button className="ml-auto mt-2 sm:mt-0">Follow</Button>
        </div>
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
