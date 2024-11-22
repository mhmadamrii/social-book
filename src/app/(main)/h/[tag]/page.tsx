import Image from "next/image";

import { Bookmark, ExternalLink } from "lucide-react";
import { Link } from "next-view-transitions";
import { Suspense } from "react";
import { BookmarkCard } from "~/components/globals/bookmark-card";
import { NoPostFound } from "~/components/globals/no-post-found";
import { PostCard } from "~/components/globals/post-card";
import { PostSkeleton } from "~/components/globals/post-skeleton";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { removeHashtags, getInitial, extractHashtags } from "~/lib/utils";

export default function PostDetail({ params }: { params: { tag: string } }) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="rounded-2xl bg-slate-900 p-4">
        <h1 className="text-center text-3xl font-bold">
          Posts for #{params.tag}
        </h1>
      </div>
      <Suspense fallback={<PostSkeleton />}>
        <PostDetailWithServerData hashtag={params.tag} />
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
      {post.map((item) => {
        const postHashtags = extractHashtags(item?.content as string);

        return (
          <section
            key={item?.id}
            className="rounded-2xl bg-slate-900 px-4 py-4 hover:bg-slate-900/80"
          >
            <div className="flex items-center justify-between">
              <div className="flex w-full items-center gap-2">
                <Avatar>
                  <AvatarImage src={item.user?.image as string} />
                  <AvatarFallback>
                    {getInitial(item.user?.name as string)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-bold">
                    {item.user.name}
                    {" · "} @{item.user.username}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    4 hours ago
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <p>{removeHashtags(item?.content as string)}</p>
                <div className="flex flex-wrap gap-2">
                  {postHashtags.map((hashtag, idx) => (
                    <span
                      key={idx}
                      className="cursor-pointer text-blue-500 hover:underline"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
                <div className="flex w-full items-center justify-center">
                  {item?.imageUrl && (
                    <Image
                      src={item?.imageUrl as string}
                      alt="preview"
                      width={500}
                      height={500}
                      className="size-fit max-h-[30rem] rounded-2xl"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2">
              <Separator />
              <div className="flex w-full justify-between">
                <div className="flex gap-2 text-muted-foreground">
                  <h1>{item?._count?.likes} likes</h1>
                  <h1>{item?._count?.comments} comments</h1>
                </div>

                <div className="flex items-center">
                  <Link href={`/p/${item?.id}`}>
                    <ExternalLink size={20} className="text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
