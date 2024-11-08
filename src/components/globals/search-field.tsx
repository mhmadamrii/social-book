import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

export function SearchField() {
  const handleSubmit = () => {
    console.log("Submitted");
  };
  return (
    <form method="GET" action="/search">
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
