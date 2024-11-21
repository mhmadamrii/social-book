import { Suspense } from "react";
import { AnimateLoad } from "~/components/globals/animate-load";
import { NoPostFound } from "~/components/globals/no-post-found";
import { api } from "~/trpc/server";
import { PostDetailCard } from "../_components/post-detail-card";

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <div className="flex w-full flex-col gap-4">
      <Suspense fallback={<AnimateLoad />}>
        <PostDetailWithServerData id={id} />
      </Suspense>
    </div>
  );
}

async function PostDetailWithServerData({ id }: { id: string }) {
  const post = await api.post.getPostDetailById({
    id: parseInt(id),
  });

  if (!post) {
    return <NoPostFound />;
  }

  return <PostDetailCard post={post} />;
}
