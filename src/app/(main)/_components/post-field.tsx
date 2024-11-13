"use client";

import Image from "next/image";

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UploadFile } from "~/components/globals/upload-file";
import { deleteFiles } from "~/lib/utapi";
import { AnimateUpload } from "~/components/globals/animate-upload";
import { extractHashtags } from "~/lib/utils";

export function PostField() {
  const { data: currentUser } = api.auth.getCurrentUser.useQuery();

  const router = useRouter();
  const utils = api.useUtils();
  const [isUploading, setIsUploading] = useState(false);
  const [post, setPost] = useState("");
  const [file, setFile] = useState<any>(null);

  const { mutate: createTrending } = api.trending.createTrending.useMutation();

  const { mutate, isPending } = api.post.create.useMutation({
    onSuccess: async () => {
      router.refresh();
      utils.post.invalidate();
      setPost("");
      setFile(null);
      toast.success("Post created!");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Failed to create post");
    },
  });

  const handleCreatePost = () => {
    const hashtags = extractHashtags(post);
    if (hashtags.length > 0) {
      createTrending({
        content: hashtags,
      });
    }
    mutate({
      content: post,
      imageUrl: file?.url,
    });
  };

  const deletePreviewImage = async () => {
    try {
      const deletePreview = await deleteFiles(file?.key as string);
      if (deletePreview?.success) {
        setFile(null);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <section className="mt-1 flex flex-col gap-5 rounded-2xl bg-slate-900 px-4 py-4">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={currentUser?.image as string} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <Textarea
          disabled={isPending}
          placeholder="What's going on?"
          className="rounded-2xl bg-background"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
      </div>
      <div className="relative flex items-center justify-center">
        {isUploading && <AnimateUpload />}
        {file?.url && (
          <>
            <Image
              src={file?.url as string}
              alt="preview"
              width={500}
              height={500}
              className="size-fit max-h-[30rem] rounded-2xl"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg=="
            />
            <div
              onClick={deletePreviewImage}
              className="absolute right-2 top-2 cursor-pointer"
            >
              <X />
            </div>
          </>
        )}
      </div>
      <div className="flex w-full justify-end gap-3 rounded-xl">
        <UploadFile setIsUploading={setIsUploading} setFile={setFile} />
        <Button
          onClick={handleCreatePost}
          disabled={post === "" || isPending}
          className="bg-blue-500"
        >
          Post
        </Button>
      </div>
    </section>
  );
}
