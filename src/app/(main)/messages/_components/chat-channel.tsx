import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Menu } from "lucide-react";
import { CustomEmojiPicker } from "./emoji-picker";
import { customReactionOptions } from "./reaction-picker";

import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
  ReactionSelector,
  ReactionsList,
  useChannelStateContext,
  useMessageContext,
} from "stream-chat-react";
import { forwardRef } from "react";

interface ChatChannelProps {
  open: boolean;
  openSidebar: () => void;
}

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

export function ChatChannel({ open, openSidebar }: ChatChannelProps) {
  return (
    <div className={cn("w-full md:block", !open && "hidden")}>
      <Channel EmojiPicker={() => <CustomEmojiPicker />}>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}

function CustomChannelHeader({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}
