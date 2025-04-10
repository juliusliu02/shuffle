import React from "react";
import { cn } from "@/lib/utils";

type WithClass = {
  className?: string;
};

export const PageTitle = ({
  children,
  className,
}: React.PropsWithChildren<WithClass>) => {
  return <h1 className={cn("text-2xl font-bold", className)}>{children}</h1>;
};
