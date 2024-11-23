"use client";

import { User2Icon } from "lucide-react";
import { Link } from "next-view-transitions";
import { api } from "~/trpc/react";
import { AnimateUpload } from "~/components/globals/animate-upload";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useQueryState } from "nuqs";
import { useState } from "react";

import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "~/components/ui/multi-select";

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
];

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export function DialogSelectUser({
  showNewChatDialog,
  onOpenChange,
}: {
  showNewChatDialog: boolean;
  onOpenChange: any;
}) {
  const [value, setValue] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useQueryState("u", {
    defaultValue: "",
  });

  const { data: allUsers, isLoading } = api.auth.getAllSearchableUsers.useQuery(
    undefined,
    {
      enabled: isOpen,
    },
  );

  const filteredUsers = allUsers?.filter((user) =>
    user!.username!?.toLowerCase().includes(search?.toLowerCase()),
  );

  console.log("filtered", filteredUsers);

  return (
    <Dialog open={showNewChatDialog} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User2Icon />
            Search Users
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <MultiSelector values={value} onValuesChange={setValue} loop={false}>
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Select your framework" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {options.map((option, i) => (
                  <MultiSelectorItem key={i} value={option.value}>
                    {option.label}
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4"></ScrollArea>
        </div>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
