import * as React from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 2 | 3 | 4 | 6;
}

export function ResponsiveGrid({
  cols = 4,
  className,
  children,
  ...props
}: ResponsiveGridProps) {
  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <div
      className={cn("grid gap-4 sm:gap-6", colClasses[cols], className)}
      {...props}
    >
      {children}
    </div>
  );
}
