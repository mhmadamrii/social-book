"use client";

import React, { useState } from "react";

import { ReactionBarSelector } from "@charkour/react-reactions";
import { Heart } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface ReactionButtonProps {
  onClickReaction: (r: string) => void;
}

export function ReactionButton({ onClickReaction }: ReactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleReaction = (r: string) => {
    let emoji = "";
    switch (r) {
      case "satisfaction":
        emoji = "😀";
        break;
      case "love":
        emoji = "❤️";
        break;
      case "happy":
        emoji = "😆";
        break;
      case "surprise":
        emoji = "😮";
        break;
      case "sad":
        emoji = "😢";
        break;
      case "angry":
        emoji = "😡";
        break;
      default:
        break;
    }

    onClickReaction(emoji);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <div className="">
        <Popover defaultOpen>
          <PopoverTrigger>
            <Heart />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="right-0 w-auto border-none bg-transparent p-0"
          >
            <ReactionBarSelector
              onSelect={(r) => handleReaction(r)}
              iconSize={20}
              style={{
                backgroundColor: "#0f172a",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
