import Link from "next/link";

import { Bell, Bookmark, Home, Mail } from "lucide-react";
import { Button } from "~/components/ui/button";

export function LeftBar() {
  const data = {
    unreadCount: 2,
  };

  return (
    <aside className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card bg-slate-900 px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80">
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden text-lg lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Notifications"
        asChild
      >
        <Link href="/notifications">
          <div className="relative">
            <Bell />
            {!!data.unreadCount && (
              <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
                {data.unreadCount}
              </span>
            )}
          </div>
          <span className="hidden text-lg lg:inline">Notifications</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Messages"
        asChild
      >
        <Link href="/messages">
          <div className="relative">
            <Mail />
            {!!data.unreadCount && (
              <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
                {data.unreadCount}
              </span>
            )}
          </div>
          <span className="hidden text-lg lg:inline">Messages</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden text-lg lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </aside>
  );
}
