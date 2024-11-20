export function NoCommentFound({ message }: { message?: string }) {
  return (
    <div className="mb-20 mt-[20px] flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">No Comment Found</h1>
      <p className="text-muted-foreground">
        {message ??
          "Sorry, we couldn't find any post matching your search criteria."}
      </p>
    </div>
  );
}
