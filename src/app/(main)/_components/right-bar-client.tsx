"use client";

import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export function RightBarClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        "sticky top-[6rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80",
        {
          "sm:hidden md:hidden lg:hidden": pathname.includes("messages"),
        },
      )}
    >
      {children}
    </aside>
  );
}
