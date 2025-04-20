import React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropdown from "@/components/user-dropdown";
import type { User } from "@/lib/types";

type NavbarProps = {
  user: User;
};

const Navbar = ({ user }: NavbarProps) => {
  return (
    <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center border-b px-4 z-10">
      <SidebarTrigger />
      <NavigationMenu className="ml-auto">
        <NavigationMenuList className="relative gap-1">
          <NavigationMenuItem>
            <UserDropdown user={user} />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default Navbar;
