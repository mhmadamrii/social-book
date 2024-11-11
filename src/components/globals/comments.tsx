import { SendHorizonal } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RefObject, useState } from "react";
import { api } from "~/trpc/react";
import { UserCommentCard } from "./user-comment-card";
import { LoadingSpinner } from "./loading-spinner";
import { UserSkeleton } from "./user-skeleton";

interface CommentsProps {
  postId: number;
  commentRef: RefObject<HTMLInputElement>;
}

export function Comments({ commentRef, postId }: CommentsProps) {
  const utils = api.useUtils();
  const [comment, setComment] = useState("");

  const { data: comments, isLoading } = api.post.getAllComments.useQuery({
    postId: postId,
  });

  const { mutate, isPending } = api.post.createComment.useMutation({
    onSuccess: () => {
      utils.post.invalidate();
      commentRef.current?.focus();
      setComment("");
    },
  });

  const formSubmitHandler = (e: any) => {
    e.preventDefault();
    mutate({
      id: postId,
      content: comment,
    });
  };

  if (isLoading) {
    return <UserSkeleton count={2} />;
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={formSubmitHandler}>
      <div className="flex items-center justify-center gap-2">
        <Input
          value={comment}
          disabled={isPending}
          onChange={(e) => setComment(e.target.value)}
          ref={commentRef}
          placeholder="Write a comment..."
          className="w-full"
        />
        <Button
          disabled={comment === ""}
          className="h-[40px] w-[40px]"
          variant="ghost"
        >
          {isPending ? <LoadingSpinner /> : <SendHorizonal />}
        </Button>
      </div>

      <div>
        {comments?.length === 0 && (
          <h1 className="text-center">No comment yet.</h1>
        )}

        {comments?.map((item) => (
          <UserCommentCard key={item.id} userComment={item} />
        ))}
      </div>
    </form>
  );
}
