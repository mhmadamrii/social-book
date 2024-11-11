import Link from "next/link";

import { Suspense } from "react";
import { LoadingSpinner } from "~/components/globals/loading-spinner";
import { api } from "~/trpc/server";
import { UserCard } from "./user-card";

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
  const availableUsers = await api.following.getAvailableFollows();

  return (
    <div className="space-y-3 rounded-2xl bg-card bg-slate-900 p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      <div className="flex w-full flex-col gap-3">
        {availableUsers
          ?.slice(1, 4)
          .map((item) => <UserCard key={item.id} user={item} />)}
      </div>
      <Link
        href="/users"
        className="flex w-full justify-center text-center hover:underline"
      >
        See all users
      </Link>
    </div>
  );
}

function TrendingTopics() {
  return (
    <div className="space-y-5 rounded-2xl bg-card bg-slate-900 p-5 shadow-sm">
      <div className="text-xl font-bold">Trending Topics</div>
    </div>
  );
}
