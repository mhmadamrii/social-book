"use client";

import { signIn } from "next-auth/react";
import { DiscordIcon } from "~/components/globals/discord-icon";
import { Button } from "~/components/ui/button";

export function DiscordButton() {
  return (
    <div className="flex w-full justify-center">
      <Button
        type="button"
        onClick={() => signIn("discord")}
        className="inline-flex items-center rounded-2xl bg-[#5865F2] px-4 py-2 font-semibold text-white hover:bg-[#4752C4]"
      >
        <DiscordIcon />
        Login with Discord
      </Button>
    </div>
  );
}
