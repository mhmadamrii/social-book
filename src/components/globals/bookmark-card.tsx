"use client";

import Image from "next/image";

import { extractHashtags, getInitial, removeHashtags } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bookmark, ExternalLink } from "lucide-react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import { Link } from "next-view-transitions";

export function BookmarkCard({ item }: { item: any }) {
  const router = useRouter();
  const postHashtags = extractHashtags(item?.post?.content as string);
  const utils = api.useUtils();

  const { mutate: deleteBookmark } = api.bookmark.deleteBookmark.useMutation({
    onSuccess: () => {
      toast.success("Post removed!");
      utils.bookmark.invalidate();
      router.refresh();
    },
  });

  return (
    <section className="cursor-pointer rounded-2xl bg-slate-900 px-4 py-4 hover:bg-slate-900/80">
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
            <p className="text-[12px] text-muted-foreground">4 hours ago</p>
          </div>
        </div>

        <div>
          <Bookmark
            onClick={() => deleteBookmark({ postId: item.post.id })}
            fill={"#3b82f6"}
            className="cursor-pointer text-blue-500"
          />
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-2">
          <p>{removeHashtags(item?.post?.content as string)}</p>
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
            {item?.post?.imageUrl && (
              <Image
                src={item?.post?.imageUrl as string}
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
            <h1>{item?.post?._count?.likes} likes</h1>
            <h1>{item?.post?._count?.comments} comments</h1>
          </div>

          <div className="flex items-center">
            <Link href={`/p/${item?.post?.id}`}>
              <ExternalLink size={20} className="text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
