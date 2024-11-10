import { PostCard } from "~/components/globals/post-card";
import { api } from "~/trpc/server";

export async function YourFeed({ userId }: { userId: string | undefined }) {
  const posts = await api.post.getAllPosts();
  console.dir(posts, { depth: null });

  if (posts.length === 0) {
    return (
      <div>
        <h1 className="text-center">No post yet.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts?.map((item) => (
        <PostCard
          key={item.id}
          createdAt={item.createdAt}
          updatedAt={item.updatedAt}
          userId={item.userId}
          id={item.id}
          title={item.content}
          likesCount={item._count.likes}
          commentsCount={item._count.comments}
          creator={item.user}
          isLikedByUser={item.likes.some((like) => like.userId === userId)}
        />
      ))}
    </div>
  );
}
