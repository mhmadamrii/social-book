import Link from "next/link";

import { Suspense } from "react";
import { LoadingSpinner } from "~/components/globals/loading-spinner";
import { api } from "~/trpc/server";
import { UserCard } from "./user-card";
import { TrendingUp, UserPlus } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { SearchUser } from "~/components/globals/search-user";

export function RightBar() {
  return (
    <aside className="sticky top-[6rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<LoadingSpinner />}>
        <WhoToFollow />
      </Suspense>
      <TrendingTopics />
    </aside>
  );
}

async function WhoToFollow() {
  const [availableUsers, currentUser] = await Promise.all([
    api.following.getAvailableFollows(),
    api.auth.getCurrentUser(),
  ]);

  return (
    <div className="space-y-3 rounded-2xl bg-card bg-slate-900 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xl font-bold">
        <UserPlus className="h-5 w-5" />
        Who to follow
      </div>
      <div className="flex w-full flex-col gap-3">
        {availableUsers
          ?.slice(0, 3)
          .map((item) => (
            <UserCard
              key={item.id}
              user={item}
              followersCount={item._count.followings}
              isAlreadyFollowing={
                currentUser?.followers.some(
                  (following) => following.followingId === item.id,
                ) ?? false
              }
            />
          ))}
      </div>
      <SearchUser />
    </div>
  );
}

async function TrendingTopics() {
  const trendings = await api.trending.getAllTrendings();
  return (
    <div className="space-y-5 rounded-2xl bg-card bg-slate-900 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xl font-bold">
        <TrendingUp className="h-5 w-5" />
        Trending Topics
      </div>
      <div className="flex flex-col gap-2">
        {trendings.slice(0, 3).map((item: any) => (
          <div
            key={item.hashtag}
            className="flex items-center justify-between gap-2"
          >
            <Badge className="rounded-3xl bg-blue-500 text-sm font-medium">
              {item?.hashtag}
            </Badge>

            <span className="text-sm text-muted-foreground">
              {item?.count} posts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
