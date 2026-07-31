import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ContentWrapper({ className, children, ...props }: ContentWrapperProps) {
  return (
    <div className={cn("space-y-6 sm:space-y-8", className)} {...props}>
      {children}
    </div>
  );
}
