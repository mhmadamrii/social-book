"use client";

import kyInstance from "~/lib/ky";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "./_components/chat";

export default function Messages() {
  const { data: session } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    client
      .connectUser(
        {
          id: session?.current_user?.id,
          name: session?.current_user?.name,
          image: session?.current_user?.image,
          username: session?.current_user?.username,
        } as any,
        async () =>
          kyInstance
            .get("/api/get-token")
            .json<{ token: string }>()
            .then((data) => data.token),
      )
      .catch((error) => console.error("Failed to connect user", error))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("Failed to disconnect user", error))
        .then(() => console.log("Connection closed"));
    };
  }, [session?.current_user]);

  return (
    <main className="mb-4 min-h-max w-full rounded-2xl bg-slate-900">
      {!chatClient ? (
        <span>Loading....</span>
      ) : (
        <div className="h-full">
          <Chat chatClient={chatClient} />
        </div>
      )}
    </main>
  );
}
