import Link from "next/link";

import { UserButton } from "./user-button";
import { SearchField } from "./search-field";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-start gap-1 px-2 py-3 sm:justify-between sm:gap-5 sm:px-5">
        <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Link href="/" className="text-md font-bold text-primary sm:text-2xl">
            Social-Book
          </Link>
          <SearchField />
        </div>

        <div className="hidden sm:block">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
