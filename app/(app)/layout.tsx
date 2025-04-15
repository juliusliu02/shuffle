import React from "react";
import Navbar from "@/components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute w-full top-0">
        <Navbar />
      </div>
      {children}
    </>
  );
}
