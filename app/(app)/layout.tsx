import React from "react";
import Navbar from "@/components/navbar";
import { validateSessionToken } from "@/server/services/auth";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/server/utils/cookie";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

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
