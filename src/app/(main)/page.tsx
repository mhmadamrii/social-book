import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { PostField } from "./_components/post-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { YourFeed } from "./_components/your-feed";
import { FollowingFeed } from "./_components/following-feed";

export default async function Home() {
  const session = await auth();
  console.log("session", session);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full space-y-5">
      <PostField />
      <div className="w-full">
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <YourFeed userId={session?.user.id} />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
