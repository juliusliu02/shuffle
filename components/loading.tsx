import { cn } from "@/lib/utils";
import React from "react";
import { LoaderCircle } from "lucide-react";

export const LoadingSpinner: React.FC<{ className: string }> = ({
  className,
}) => <LoaderCircle className={cn("animate-spin", className)} />;
