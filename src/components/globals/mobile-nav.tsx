"use client";

import { Link } from "next-view-transitions";

import { Bell, Bookmark, Home, Mail, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/trpc/react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";

export function MobileNav() {
  const session = useSession();

  if (!session.data) {
    return <UnAutheticatedMobileNav />;
  }

  return <AutheticatedMobileNav />;
}

function AutheticatedMobileNav() {
  const { data: currentUser } = api.auth.getCurrentUser.useQuery();

  const data = {
    unreadCount: 2,
  };

  return (
    <section className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden">
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
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden text-lg lg:inline">Notifications</span>
      </Link>

      <Link
        className="flex items-center justify-start gap-3 rounded-md px-3 py-2 hover:bg-slate-800"
        href="/"
      >
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
      <Link
        className="flex items-center justify-start gap-3 rounded-md px-3 py-2 hover:bg-slate-800"
        href="/bookmarks"
      >
        <Bookmark />
        <span className="hidden text-lg lg:inline">Bookmarks</span>
      </Link>
      <Drawer>
        <DrawerTrigger>
          <Avatar className="h-[30px] w-[30px]">
            <AvatarImage src={currentUser?.image as string} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="destructive" onClick={() => signOut()}>
              Logout
            </Button>
            <DrawerClose>
              <span>Close</span>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  );
}

function UnAutheticatedMobileNav() {
  return (
    <section className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1">
          <MessageCircle className="h-8 w-8 text-blue-500" fill="#3b82f6" />
          <h1 className="text-xl font-bold text-primary sm:text-2xl">
            Social-Book
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="flex w-[80px] items-center justify-center rounded-xl bg-blue-500 px-2 py-1 hover:bg-blue-500/90"
            href="/login"
          >
            Login
          </Link>

          <Link
            className="flex w-[80px] items-center justify-center rounded-xl bg-slate-500 px-2 py-1 hover:bg-slate-500/90"
            href="/register"
          >
            Signup
          </Link>
        </div>
      </div>
    </section>
  );
}
