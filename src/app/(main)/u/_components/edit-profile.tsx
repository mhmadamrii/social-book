"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";

const maleAvatars = [
  "https://avatar.iran.liara.run/public/34",
  "https://avatar.iran.liara.run/public/8",
  "https://avatar.iran.liara.run/public/13",
  "https://avatar.iran.liara.run/public/48",
  "https://avatar.iran.liara.run/public/30",
];

const femaleAvatars = [
  "https://avatar.iran.liara.run/public/93",
  "https://avatar.iran.liara.run/public/74",
  "https://avatar.iran.liara.run/public/79",
  "https://avatar.iran.liara.run/public/52",
  "https://avatar.iran.liara.run/public/100",
];

export function EditProfile() {
  const utils = api.useUtils();
  const router = useRouter();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const { mutate, isPending } = api.auth.editProfile.useMutation({
    onSuccess: () => {
      utils.auth.invalidate();
      router.refresh();
      toast.success("Profile updated!");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-center">Male Avatar</Label>
            <div className="flex flex-wrap justify-center gap-4">
              {maleAvatars.map((avatar) => (
                <div
                  key={avatar}
                  className={`relative cursor-pointer rounded-full transition hover:opacity-75 ${
                    selectedAvatar === avatar ? "ring-4 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={avatar} alt="Avatar" />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label className="text-center">Female Avatar</Label>
            <div className="flex flex-wrap justify-center gap-4">
              {femaleAvatars.map((avatar) => (
                <div
                  key={avatar}
                  className={`relative cursor-pointer rounded-full transition hover:opacity-75 ${
                    selectedAvatar === avatar ? "ring-4 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={avatar} alt="Avatar" />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => mutate({ name, imageUrl: selectedAvatar, bio })}
            disabled={!name || !selectedAvatar}
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
