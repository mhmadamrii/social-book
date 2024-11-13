"use client";

import Image from "next/image";

import { extractHashtags, getInitial, removeHashtags } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bookmark } from "lucide-react";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";

export function BookmarkCard({ item }: { item: any }) {
  const router = useRouter();
  const postHashtags = extractHashtags(item?.post?.content as string);
  const utils = api.useUtils();

  const { mutate: deleteBookmark } = api.bookmark.deleteBookmark.useMutation({
    onSuccess: () => {
      utils.bookmark.invalidate();
      router.refresh();
      toast({
        title: "Bookmark removed",
        description: "lorem ipsum",
      });
    },
  });

  return (
    <section className="rounded-2xl bg-slate-900 px-4 py-4">
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
            {postHashtags.map((hashtag) => (
              <span
                key={hashtag}
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
    </section>
  );
}
