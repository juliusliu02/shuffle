import React from "react";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropdown from "@/components/user-dropdown";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

type NavbarProps = {
  user: User;
};

const Navbar = ({ user }: NavbarProps) => {
  return (
    <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center border-b px-4 z-10">
      <SidebarTrigger />
      <div className="mx-2 h-4">
        <Separator orientation="vertical" />
      </div>
      {/* let wrapper div grow to full width */}
      <NavigationMenu className="[&>div]:flex-1 w-full max-w-full">
        <NavigationMenuList className="justify-between">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                className={cn(navigationMenuTriggerStyle(), "px-2")}
                href="/"
              >
                New Article
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <UserDropdown user={user} />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default Navbar;
