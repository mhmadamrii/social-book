import { Skeleton } from "../ui/skeleton";

export function PostSkeleton({ count = 3 }: { count?: number }) {
  return (
    <section className="flex w-full flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </section>
  );
}

const SkeletonItem = () => {
  return (
    <section className="flex flex-col gap-2 rounded-2xl border bg-slate-900 p-4">
      <div className="flex h-full w-full gap-2">
        <div className="">
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
        <div className="flex w-full flex-col justify-between gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </section>
  );
};
