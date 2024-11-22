"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useQueryState } from "nuqs";

export function SearchField() {
  const [search, setSearch] = useQueryState("q");

  const handleSubmit = () => {};

  return (
    <form method="GET" action="/search" className="w-full sm:w-auto">
      <div className="relative">
        <Input
          name="q"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="pe-10"
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-blue-500 text-muted-foreground" />
      </div>
    </form>
  );
}
