"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export default function DialogAskName({
  isOpen = true,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim()) {
      onClose?.(name);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.("")}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to SocialConnect</DialogTitle>
          <DialogDescription>
            Please enter your name to get started with your social media
            experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Enter your name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!name.trim()}>
              Get Started
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
