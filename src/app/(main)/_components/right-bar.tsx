import { Link } from "next-view-transitions";
import { Suspense } from "react";
import { LoadingSpinner } from "~/components/globals/loading-spinner";
import { api } from "~/trpc/server";
import { UserCard } from "./user-card";
import { TrendingUp, UserPlus } from "lucide-react";
import { SearchUser } from "~/components/globals/search-user";
import { auth } from "~/server/auth";
import { PeopleYouMayKnow } from "~/components/globals/people-you-may-know";
import { removeHashtag } from "~/lib/utils";
import { CurrentUserType } from "~/server/tRPCtypes";

interface _TrendingTopics {
  hashtag: string;
  count: unknown | string;
}

export async function RightBar() {
  const session = await auth();
  console.log("session current user", session?.current_user);

  if (!session) {
    return <UnAuthenticatedRightBar />;
  }

  return (
    <aside className="sticky top-[6rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<LoadingSpinner />}>
        <WhoToFollow currentUser={session?.current_user} />
      </Suspense>
      <TrendingTopics />
    </aside>
  );
}

async function WhoToFollow({ currentUser }: { currentUser: CurrentUserType }) {
  const [availableUsers] = await Promise.all([
    api.following.getAvailableFollows(),
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
                currentUser?.followers?.some(
                  (following: any) => following.followingId === item.id,
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
        {trendings.slice(0, 3).map((item: _TrendingTopics, idx: number) => (
          <div key={idx} className="flex flex-col">
            <Link
              className="font-bold text-white hover:underline"
              href={`/h/${removeHashtag(item.hashtag)}`}
            >
              {item?.hashtag}
            </Link>

            <span className="text-sm text-muted-foreground">
              {item?.count as string} posts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

async function UnAuthenticatedRightBar() {
  const peopleYouMayKnow = await api.auth.getPeopleYouMayKnow();

  return (
    <aside className="sticky top-[6rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <div className="space-y-3 rounded-2xl bg-card bg-slate-900 p-5 shadow-sm">
        <h1 className="text-xl font-bold">People you may know</h1>
        {peopleYouMayKnow.map((user) => (
          <PeopleYouMayKnow key={user.id} user={user} />
        ))}
        <SearchUser />
      </div>
    </aside>
  );
}
