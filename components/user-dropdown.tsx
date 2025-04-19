"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { ChevronDownIcon } from "lucide-react";
import type { User } from "@/lib/types";
import { authClient } from "@/lib/rpc/auth-cli";
import { LogOut } from "lucide-react";

const logOut = async () => {
  const res = await authClient.logout.$post();
  if (res.redirected) {
    window.location.href = res.url;
  } else {
    window.location.href = "/";
  }
};

const UserDropdown = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={navigationMenuTriggerStyle()}>
        {user.fullName}
        <ChevronDownIcon
          className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={logOut}>
          <LogOut />
          <span className="ml-auto">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
