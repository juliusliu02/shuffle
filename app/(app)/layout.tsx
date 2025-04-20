import React from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { validateSessionToken } from "@/server/services/auth";
import { SESSION_COOKIE_NAME } from "@/server/utils/cookie";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME);
  if (!token) {
    redirect("/login");
  }
  const { user } = await validateSessionToken(token.value);
  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar user={user} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
