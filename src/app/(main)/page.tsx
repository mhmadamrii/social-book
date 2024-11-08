import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { PostField } from "./_components/post-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { PostCard } from "~/components/globals/post-card";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const posts = [
    {
      id: 1,
      title: "Hello world for you",
      likes: 0,
      comments: 0,
      bookmarks: 0,
      createdAt: new Date(),
      user: {
        id: 1,
        name: "John Doe",
        avatar: "https://github.com/shadcn.png",
        username: "shadcn",
      },
    },
    {
      id: 2,
      title: "Hello world for you",
      likes: 0,
      comments: 0,
      bookmarks: 0,
      createdAt: new Date(),
      user: {
        id: 1,
        name: "John Doe",
        avatar: "https://github.com/shadcn.png",
        username: "shadcn",
      },
    },
    {
      id: 3,
      title: "Hello world for you",
      likes: 0,
      comments: 0,
      bookmarks: 0,
      createdAt: new Date(),
      user: {
        id: 1,
        name: "John Doe",
        avatar: "https://github.com/shadcn.png",
        username: "shadcn",
      },
    },
  ];

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
            <div className="flex flex-col gap-4">
              {posts?.map((item) => (
                <PostCard key={item.id} title={item.title} />
              ))}
            </div>
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
