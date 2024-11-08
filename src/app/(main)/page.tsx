import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { PostField } from "./_components/post-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

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
            <div className="w-full">
              <h1>Hello world for you</h1>
            </div>
          </TabsContent>
          <TabsContent value="following">
            <div>
              <h1>Hello world following</h1>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro eum
        adipisci distinctio blanditiis est delectus dolorum saepe quisquam,
        dolore, tenetur non voluptate illum id voluptatibus voluptas quis
        consequuntur doloribus eius.
      </p>
    </div>
  );
}
