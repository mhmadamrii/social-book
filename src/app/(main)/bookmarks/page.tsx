"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Bookmarks() {
  const { ref, inView } = useInView();
  const [isLoading, setIsLoading] = useState(false);

  const { data, fetchNextPage } = api.bookmark.getAllPosts.useInfiniteQuery(
    {
      limit: 2,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor || null, // Implement cursor logic
    },
  );

  const fetchNextPageWithDelay = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    fetchNextPage();
    setIsLoading(false);
  };

  useEffect(() => {
    if (inView) {
      fetchNextPageWithDelay();
    }
  }, [inView]);

  return (
    <div className="h-full w-full">
      <h1>Bookmarks</h1>
      <div className="border">
        {data?.pages.map((page, pageIndex) => (
          <div key={pageIndex} className="border border-red-500">
            <h2>Page {pageIndex + 1}</h2>
            {page?.posts?.map((item) => (
              <div key={item.id} className="h-[400px] w-full">
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div ref={ref} className="loading-indicator">
        {isLoading && <p>Loading more...</p>}
      </div>
    </div>
  );
}
