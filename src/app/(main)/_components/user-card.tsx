import { BadgeCheck } from "lucide-react";
import { VerifiedIcon } from "~/components/globals/verified-icon";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getInitial } from "~/lib/utils";

export function UserCard({ user }: { user: any }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user?.image} />
            <AvatarFallback>
              {getInitial(user.username ?? user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="flex items-center gap-1">
              {user.name ?? ""}
              {user?.isVerified && (
                <span>
                  <VerifiedIcon />
                </span>
              )}
            </h2>
            <p className="text-sm">@{user.username ?? ""}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Button className="rounded-xl">Follow</Button>
        </div>
      </div>
      <Separator className="w-full" />
    </>
  );
}
