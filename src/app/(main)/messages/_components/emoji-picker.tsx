"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useMessageInputContext } from "stream-chat-react";

// emoji reaction
const emojis = ["👍", "👎", "😀", "😐", "🙄", "😉"];

export const CustomEmojiPicker = () => {
  const [open, setOpen] = useState(false);

  const { insertText, textareaRef } =
    useMessageInputContext("CustomEmojiPicker");

  return (
    <div id="emoji-picker" className="flex items-end justify-end rounded-md">
      {open && (
        <div className="absolute -top-[30px] rounded-2xl bg-slate-900 p-3">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                insertText(emoji);
                textareaRef.current?.focus(); // returns focus back to the message input element
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <button onClick={() => setOpen((isOpen) => !isOpen)}>
        {open ? <X /> : "😀"}
      </button>
    </div>
  );
};
