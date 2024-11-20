import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export function NotificationSkeleton({ count = 3 }: { count?: number }) {
  return Array.from({ length: count }).map((_, idx) => (
    <div
      key={idx}
      className="my-4 flex w-full flex-col justify-center gap-4 rounded-xl"
    >
      <div className="flex w-full justify-between gap-2">
        <div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <Separator />
    </div>
  ));
}
