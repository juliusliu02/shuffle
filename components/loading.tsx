import React from "react";

import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export const LoadingSpinner: React.FC<{ className?: string }> = ({
  className,
}) => <LoaderCircle className={cn("animate-spin", className)} />;
