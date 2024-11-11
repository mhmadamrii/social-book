"use client";

import Image from "next/image";

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { UploadFile } from "~/components/globals/upload-file";
import { deleteFiles } from "~/lib/utapi";

export function PostField() {
  const { toast } = useToast();

  const router = useRouter();
  const utils = api.useUtils();
  const [isUploading, setIsUploading] = useState(false);
  const [post, setPost] = useState("");
  const [file, setFile] = useState<any>(null);

  const { mutate, isPending } = api.post.create.useMutation({
    onSuccess: async (res) => {
      router.refresh();
      utils.post.invalidate();
      setPost("");
      toast({
        title: "Post Created",
        description: "lorem ipsum",
      });
    },
    onError: (err) => {
      console.log(err);
      toast({
        title: "Error",
        description: "lorem ipsum",
      });
    },
  });

  const handleCreatePost = () => {
    mutate({
      content: post,
    });
  };

  const deletePreviewImage = async () => {
    console.log("the file", file);
    try {
      const deletePreview = await deleteFiles(file?.key as string);
      console.log("deletePreview", deletePreview);
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
          <AvatarImage src="https://github.com/shadcn.png" />
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
        {isUploading && (
          <div className="flex items-center justify-center space-x-2 dark:invert">
            <span className="sr-only">Loading...</span>
            <div className="h-5 w-5 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
            <div className="h-5 w-5 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
            <div className="h-5 w-5 animate-bounce rounded-full bg-black"></div>
          </div>
        )}
        {file?.url && (
          <>
            <Image
              src={file?.url as string}
              alt="preview"
              width={500}
              height={500}
              className="size-fit max-h-[30rem] rounded-2xl"
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
