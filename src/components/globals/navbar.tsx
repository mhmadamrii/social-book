import { Link } from "next-view-transitions";

import { UserButton } from "./user-button";
import { SearchField } from "./search-field";
import { api } from "~/trpc/server";
import { auth } from "~/server/auth";
import { cn } from "~/lib/utils";

export async function Navbar() {
  const session = await auth();
  console.log("session", session);

  return (
    <header
      className={cn(
        "sticky top-0 z-10 h-[70px] bg-card shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:bg-slate-900",
        {
          "flex items-center": !session,
        },
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-start gap-1 px-2 py-3 sm:justify-between sm:gap-5 sm:px-5">
        <div
          className={cn(
            "flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center",
            {
              "flex-row": !session,
            },
          )}
        >
          <Link href="/" className="text-md font-bold text-primary sm:text-2xl">
            Social-Book
          </Link>
          <SearchField />
        </div>

        <div
          className={cn("hidden sm:block", {
            "hidden sm:hidden": !session,
          })}
        >
          <UserButton />
        </div>
      </div>
    </header>
  );
}
