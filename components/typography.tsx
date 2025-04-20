import React from "react";

import { cn } from "@/lib/utils";

type WithClass = {
  className?: string;
};

export const PageTitle = ({
  children,
  className,
}: React.PropsWithChildren<WithClass>) => {
  return <h1 className={cn("text-3xl font-bold", className)}>{children}</h1>;
};

export const Mark = ({
  children,
  className,
}: React.PropsWithChildren<WithClass>) => {
  return (
    <mark
      className={cn(
        "bg-amber-300 px-1 py-0.5 rounded-md shadow-sm shadow-amber-300/50 box-decoration-clone dark:bg-amber-700 text-foreground dark:shadow-amber-700/50",
        className,
      )}
    >
      {children}
    </mark>
  );
};
