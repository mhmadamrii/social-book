"use client";

import React from "react";

import { ReactionBarSelector } from "@charkour/react-reactions";
import { Heart } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export default function Notification() {
  return (
    <div className="w-full">
      <div className="">
        <Popover>
          <PopoverTrigger>
            <Heart />
          </PopoverTrigger>
          <PopoverContent className="right-0 w-auto border-none bg-transparent p-0">
            <ReactionBarSelector
              onSelect={(r) => console.log("r is", r)}
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
