"use client";

import Link from "next/link";

import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function UserButton() {
  const { theme, setTheme } = useTheme();

  const user = {
    username: "daniel",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          viewBox="0 0 256 256"
          className="h-[3.2rem] w-[2.5rem] cursor-pointer fill-current"
        >
          <g fill="none" strokeMiterlimit="10" strokeWidth="0">
            <path
              fill="#D6D6D6"
              d="M127.857 248.687c-31.048 0-59.516-5.629-81.55-24.262-27.445-23.213-44.9-57.892-44.9-96.568 0-69.725 56.725-126.45 126.45-126.45s126.45 56.725 126.45 126.45c0 38.68-17.456 73.355-44.901 96.568-22.03 18.636-50.502 24.262-81.55 24.262"
            ></path>
            <path
              fill="#A5A4A4"
              d="M127.857 172.002c-32.256 0-58.499-26.243-58.499-58.496 0-32.256 26.243-58.499 58.499-58.499s58.495 26.243 58.495 58.499c0 32.253-26.24 58.496-58.495 58.496"
            ></path>
            <path
              fill="#A5A4A4"
              d="M127.857 254.307a126.5 126.5 0 0 1-81.57-29.857 5.62 5.62 0 0 1-1.626-6.286c13.041-34.335 46.477-57.402 83.196-57.402s70.154 23.067 83.195 57.402a5.62 5.62 0 0 1-1.627 6.286 126.5 126.5 0 0 1-81.568 29.857"
            ></path>
          </g>
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 size-4" />
                System default
                {theme === "system" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 size-4" />
                Light
                {theme === "light" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 size-4" />
                Dark
                {theme === "dark" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
