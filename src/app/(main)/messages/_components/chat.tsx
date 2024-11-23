import { useTheme } from "next-themes";
import { Chat as StreamChat } from "stream-chat-react";
import { StreamChat as StreamChatType } from "stream-chat";
import { useState } from "react";
import { ChatSidebar } from "./chat-sidebar";
import { ChatChannel } from "./chat-channel";

export function Chat({ chatClient }: { chatClient: StreamChatType }) {
  const { resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <main className="relative h-full w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
}
