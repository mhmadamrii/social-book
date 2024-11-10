import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export function UserCommentCard({ userComment }: { userComment: any }) {
  return (
    <section className="my-4 flex w-full flex-col gap-2 px-2 py-4">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div>
          <h1>Username</h1>
          <p>{userComment.content}</p>
        </div>
      </div>

      <Separator />
    </section>
  );
}
