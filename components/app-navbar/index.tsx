import React from "react";

import Link from "next/link";

import UserDropdown from "@/components/app-navbar/user-dropdown";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@/lib/types";

type NavbarProps = {
  user: User;
};

const AppNavbar = ({ user }: NavbarProps) => {
  return (
    <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center border-b px-4 z-10">
      <SidebarTrigger />
      <div className="ml-2 mr-1 h-4">
        <Separator orientation="vertical" />
      </div>
      {/* let wrapper div grow to full width */}
      <NavigationMenu className="[&>div]:flex-1 w-full max-w-full">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link className={navigationMenuTriggerStyle()} href="/">
                Articles
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link className={navigationMenuTriggerStyle()} href="#">
                Flashcards
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <div className="flex-1"></div>
          <NavigationMenuItem>
            <UserDropdown user={user} />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default AppNavbar;
