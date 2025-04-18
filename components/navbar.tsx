import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React from "react";
import Link from "next/link";
import type { User } from "@/lib/types";
import UserDropdown from "@/components/user-dropdown";

type NavbarProps = {
  user: User;
};

const Navbar = ({ user }: NavbarProps) => {
  return (
    <div className="flex justify-between items-center px-8 py-4 bg-card">
      <Link href="/" className="text-xl font-semibold">
        Shuffle
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="relative gap-1">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link className={navigationMenuTriggerStyle()} href="/">
                Add Article
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link className={navigationMenuTriggerStyle()} href="/articles">
                My Articles
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <UserDropdown user={user} />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
