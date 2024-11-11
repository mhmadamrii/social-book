import { PostSkeleton } from "~/components/globals/post-skeleton";
import { UserSkeleton } from "~/components/globals/user-skeleton";

export function FollowingFeed() {
  return <PostSkeleton count={3} />;
}
