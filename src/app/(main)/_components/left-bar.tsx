"use client";

import { Link } from "next-view-transitions";

import { api } from "~/trpc/react";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import { AppIcon } from "./app-icon";

export function LeftBar() {
  const session = useSession();

  if (!session.data) {
    return <UnAutheticatedLeftBar />;
  }

  return <AuthenticatedLeftBar />;
}

function AuthenticatedLeftBar() {
  const { data: notifications } = api.post.getMyNotifications.useQuery(
    undefined,
    {
      refetchInterval: 50000, // refetch for every 50 seconds
    },
  );

  const data = {
    unreadCount: 2,
  };
  return (
    <aside className="sticky top-[6rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card bg-slate-900 px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80">
      <Link
        className="flex items-center justify-start gap-3 rounded-md px-3 py-2 hover:bg-slate-800"
        href="/"
      >
        <Home />
        <span className="hidden text-lg lg:inline">Home</span>
      </Link>

      <Link
        className="flex items-center justify-start gap-3 rounded-md px-3 py-2 hover:bg-slate-800"
        href="/notifications"
      >
        <div className="relative">
          <Bell />
          {notifications?.unreadCount !== 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {notifications?.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden text-lg lg:inline">Notifications</span>
      </Link>

      <Link
        className="flex items-center justify-start gap-3 rounded-md px-3 py-2 hover:bg-slate-800"
        href="/messages"
      >
        <div className="relative">
          <Mail />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data?.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden text-lg lg:inline">Messages</span>
      </Link>
      <Link
        prefetch
        className="flex items-center justify-start gap-3 rounded-md px-3 py-2 hover:bg-slate-800"
        href="/bookmarks"
      >
        <Bookmark />
        <span className="hidden text-lg lg:inline">Bookmarks</span>
      </Link>
    </aside>
  );
}

function UnAutheticatedLeftBar() {
  return (
    <aside className="sticky top-[6rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <div className="space-y-3 rounded-2xl bg-card bg-slate-900 p-5 shadow-sm">
        <div className="flex items-center gap-1">
          <AppIcon />
          <h1 className="text-xl font-bold">Join the conversation</h1>
        </div>
        <div className="flex gap-2">
          <Link
            className="flex w-[80px] items-center justify-center rounded-md bg-blue-500 px-2 py-1 hover:bg-blue-500/90"
            href="/login"
          >
            Login
          </Link>

          <Link
            className="flex w-[80px] items-center justify-center rounded-md bg-slate-500 px-2 py-1 hover:bg-slate-500/90"
            href="/register"
          >
            Signup
          </Link>
        </div>
      </div>
    </aside>
  );
}
