import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { PostField } from "./_components/post-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { PostSkeleton } from "~/components/globals/post-skeleton";
import { YourFeed } from "./_components/your-feed";
import { Suspense } from "react";

export default async function Home() {
  const [session] = await Promise.all([auth()]);

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
            <PostSkeleton count={2} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
