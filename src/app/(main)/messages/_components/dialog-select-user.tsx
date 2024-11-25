"use client";

import { User2Icon } from "lucide-react";
import { Link } from "next-view-transitions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { UserResponse } from "stream-chat";
import { useDebounce } from "~/hooks/use-debounce";
import { deleteAllStreamChatUsers } from "~/actions/stream.action";
import { toast } from "sonner";

import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "~/components/ui/multi-select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  const { data: session } = useSession();
  const { client, setActiveChannel } = useChatContext();
  const { data: allUsers } = api.auth.getAllSearchableUsers.useQuery(undefined);

  const [value, setValue] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const searchInputDebounced = useDebounce(searchInput);
  const [selectedUsers, setSelectedUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);

  const userLists = allUsers
    ?.filter((i) => i.id !== session?.current_user?.id)
    .map((u) => {
      return {
        label: u.username ?? "",
        value: u.id ?? "",
      };
    });

  const {
    data: availableChatUsers,
    isFetching,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["stream-users", searchInputDebounced],
    queryFn: async () =>
      client.queryUsers(
        {
          // @ts-expect-error
          id: { $ne: session?.current_user?.id },
          role: { $ne: "admin" },
          ...(searchInputDebounced
            ? {
                $or: [
                  { name: { $autocomplete: searchInputDebounced } },
                  { username: { $autocomplete: searchInputDebounced } },
                ],
              }
            : {}),
        },
        { name: 1, username: 1 },
        { limit: 15 },
      ),
  });

  const { mutate: createConversation, error } = useMutation({
    mutationFn: async () => {
      const channel = client.channel("messaging", {
        members: [`${session?.current_user?.id}`, ...value],
        name: "",
      });
      await channel.create();
      return channel;
    },
    onSuccess: (res) => {
      toast.success("Conversation started");
      onOpenChange(false);
    },
    onError: (err) => {
      console.log("err", err);
      console.log(error);
    },
  });

  return (
    <Dialog open={showNewChatDialog} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="min-h-[350px] sm:max-w-[425px]">
        <DialogTitle className="flex items-center gap-2">
          <User2Icon />
          Search Users
        </DialogTitle>
        <div className="grid gap-4">
          <MultiSelector
            values={value}
            onValuesChange={(r) => {
              setValue(r);
            }}
            loop={false}
          >
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Select users" />
            </MultiSelectorTrigger>
            <MultiSelectorContent className="">
              <MultiSelectorList>
                {userLists?.map((option, i) => (
                  <MultiSelectorItem key={i} value={option.value}>
                    {option.label}
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
        </div>
        <DialogDescription>Select users to start a new chat</DialogDescription>
        <DialogFooter>
          <Button onClick={() => createConversation()}>Start Chat</Button>
          {/* <Button
            onClick={async () => {
              const listAvailable = availableChatUsers?.users?.map(
                (u: any) => u.id,
              ) as string[];
              console.log("listAvailable", listAvailable);

              await deleteAllStreamChatUsers(listAvailable).then((r) =>
                console.log(r),
              );
            }}
          >
            Delete many users
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
