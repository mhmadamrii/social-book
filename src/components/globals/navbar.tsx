import Link from "next/link";

import { UserButton } from "./user-button";
import { SearchField } from "./search-field";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card bg-slate-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          Social-Book
        </Link>
        <SearchField />
        <UserButton />
      </div>
    </header>
  );
}
