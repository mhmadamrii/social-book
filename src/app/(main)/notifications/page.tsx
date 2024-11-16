"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function PostSectionOne() {
  const [isOpenComment, setIsOpenComment] = useState(false);
  return (
    <div className="flex w-full flex-col gap-4">
      <section className="w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-white"
          >
            <h1>Posts{i}</h1>
            <Button onClick={() => setIsOpenComment(true)}>Open comment</Button>
            {isOpenComment && (
              <div>
                <h1 className="text-xl">Comment section</h1>
              </div>
            )}
          </div>
        ))}
      </section>

      <section>
        {Array.from({ length: 5 }).map((_, i) => (
          <PostSectionTwo key={i} post={`Posts${i}`} />
        ))}
      </section>
    </div>
  );
}

function PostSectionTwo({ post }: { post: string }) {
  const [isOpenComment, setIsOpenComment] = useState(false);

  return (
    <div>
      <h1>{post}</h1>
      <h1>Some new comment section</h1>
      <Button onClick={() => setIsOpenComment(!isOpenComment)}>
        Open comment
      </Button>
      {isOpenComment && (
        <div>
          <h1 className="text-xl">Comment section</h1>
        </div>
      )}
    </div>
  );
}
