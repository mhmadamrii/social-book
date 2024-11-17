import { Suspense } from "react";
import { AnimateLoad } from "~/components/globals/animate-load";
import { NoPostFound } from "~/components/globals/no-post-found";
import { PostCard } from "~/components/globals/post-card";
import { api } from "~/trpc/server";

export default function PostDetail({ params }: { params: { id: string } }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="rounded-2xl bg-slate-900 p-4">
        <h1 className="text-center text-3xl font-bold">
          Post's for '#{params.id}'
        </h1>
      </div>
      <Suspense fallback={<AnimateLoad />}>
        <PostDetailWithServerData hashtag={params.id} />
      </Suspense>
    </div>
  );
}

async function PostDetailWithServerData({ hashtag }: { hashtag: string }) {
  const post = await api.post.getPostsByHashtag({
    hashtag,
  });

  if (!post) {
    return <NoPostFound />;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <p className="w-[300px] truncate">{JSON.stringify(post)}</p>
    </div>
  );
}
