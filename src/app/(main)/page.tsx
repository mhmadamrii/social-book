import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { PostField } from "./_components/post-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { PostCard } from "~/components/globals/post-card";
import { api } from "~/trpc/server";

export default async function Home() {
  const [session, posts] = await Promise.all([auth(), api.post.getAllPosts()]);
  console.log("posts", posts);

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
            {posts.length === 0 ? (
              <div>
                <h1 className="text-center">No post yet.</h1>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {posts?.map((item) => (
                  <PostCard
                    key={item.id}
                    createdAt={item.createdAt}
                    updatedAt={item.updatedAt}
                    userId={item.userId}
                    id={item.id}
                    title={item.content}
                    creator={item.user}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="following">
            <div>
              <h1>Hello world following</h1>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
