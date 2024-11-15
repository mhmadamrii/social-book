export function NoPostFound() {
  return (
    <div className="mt-[20px] flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">No Post Found</h1>
      <p className="text-muted-foreground">
        Sorry, we couldn't find any post matching your search criteria.
      </p>
    </div>
  );
}
