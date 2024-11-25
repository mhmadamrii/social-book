import { NoCommentFound } from "~/components/globals/no-comment-found";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getInitial, timeAgo } from "~/lib/utils";
import { PostDetaiByIdType } from "~/server/tRPCtypes";

export function CommentDetailCard({ post }: { post: PostDetaiByIdType }) {
  if (post?.comments?.length === 0) {
    return <NoCommentFound message="This post has no comments yet." />;
  }
  return post?.comments?.map((item, idx: number) => (
    <section
      key={idx}
      className="rounded-2xl bg-card px-2 py-4 dark:bg-slate-900"
    >
      <div className="mb-5 flex items-center gap-2">
        <Avatar>
          <AvatarImage src={item?.user?.image as string} />
          <AvatarFallback>
            {getInitial(item?.user?.username ?? item?.user?.name ?? "")}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center gap-2">
            <h1>{item?.user?.username ?? item.user.name}</h1>
            {" · "}
            <span className="text-[12px] text-muted-foreground">
              {timeAgo(item?.createdAt as unknown as string)}
            </span>
          </div>
          <p>{item.content}</p>
        </div>
      </div>
    </section>
  ));
}
