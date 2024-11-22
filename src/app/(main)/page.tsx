import { auth } from "~/server/auth";
import { PostField } from "./_components/post-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { YourFeed } from "./_components/your-feed";
import { FollowingFeed } from "./_components/following-feed";
import { NoPostFound } from "~/components/globals/no-post-found";

export default async function Home() {
  const session = await auth();

  return (
    <div className="w-full space-y-5">
      {session && <PostField currentUser={session?.current_user} />}
      <div className="w-full">
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">
              {session ? "For you" : "Posts"}
            </TabsTrigger>
            <TabsTrigger value="following">
              {session ? "Following" : "Feed ✨"}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <YourFeed userId={session?.user.id} />
          </TabsContent>
          <TabsContent value="following">
            {session ? (
              <FollowingFeed userId={session?.user?.id} />
            ) : (
              <NoPostFound />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
