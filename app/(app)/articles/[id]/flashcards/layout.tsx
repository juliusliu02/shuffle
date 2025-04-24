import React from "react";

export default function FlashcardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full bg-stone-50">{children}</div>;
}
