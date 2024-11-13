export function NoBookmarkFound() {
  return (
    <div className="mt-3 flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">No Bookmark Found</h1>
      <p className="text-muted-foreground">
        You don't have any bookmarks yet. Start by searching for a post and
        clicking the bookmark button to save it.
      </p>
    </div>
  );
}
