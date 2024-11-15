import { getInitial, timeAgo } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export function UserCommentCard({ userComment }: { userComment: any }) {
  return (
    <section className="my-4 flex w-full flex-col gap-2 px-2 py-4">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={userComment?.user?.image} />
          <AvatarFallback>
            {getInitial(userComment?.user?.username ?? userComment?.user?.name)}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center gap-2">
            <h1>{userComment?.user?.username ?? userComment.user.name}</h1>
            <span className="text-[12px] text-muted-foreground">
              {timeAgo(userComment.createdAt as unknown as string)}
            </span>
          </div>
          <p>{userComment.content}</p>
        </div>
      </div>
      <Separator />
    </section>
  );
}
