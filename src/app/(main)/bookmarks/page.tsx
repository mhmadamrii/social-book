import { Suspense } from "react";
import { BookmarkCard } from "~/components/globals/bookmark-card";
import { NoBookmarkFound } from "~/components/globals/no-bookmark-found";
import { PostSkeleton } from "~/components/globals/post-skeleton";
import { api } from "~/trpc/server";

export default function Bookmark() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="rounded-2xl bg-card p-4 dark:bg-slate-900">
        <h1 className="text-center text-3xl font-bold">Bookmark</h1>
      </div>
      <Suspense fallback={<PostSkeleton count={3} />}>
        <BookmarkServerData />
      </Suspense>
    </div>
  );
}

async function BookmarkServerData() {
  const bookmarks = await api.bookmark.getAllUserBookmark();

  if (bookmarks.length === 0) {
    return <NoBookmarkFound />;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {bookmarks.map((item) => (
        <BookmarkCard key={item.id} item={item} />
      ))}
    </div>
  );
}
