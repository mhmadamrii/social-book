"use client";

import { User2Icon } from "lucide-react";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useQueryState } from "nuqs";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export function SearchUser() {
  const { data: allUsers, isLoading } = api.auth.getAllUsers.useQuery();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useQueryState("u", {
    defaultValue: "",
  });

  const filteredUsers = allUsers?.filter((user) =>
    user!.username!?.toLowerCase().includes(search?.toLowerCase()),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <h1 className="w-full cursor-pointer text-center hover:underline">
          All users
        </h1>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User2Icon />
            Search Users
          </DialogTitle>
        </DialogHeader>
        {isLoading && "Loading..."}
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {filteredUsers?.map((user) => (
              <div key={user.id} className="py-2">
                {user.name ?? user.username} {" · "} @{user.username}
              </div>
            ))}
            {filteredUsers?.length === 0 && (
              <div className="text-center text-gray-500">No users found</div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
