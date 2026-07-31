import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function Divider({ label, className, ...props }: DividerProps) {
  if (label) {
    return (
      <div className={cn("relative flex items-center py-3", className)} {...props}>
        <div className="flex-grow border-t border-border/60"></div>
        <span className="flex-shrink mx-3 text-xs uppercase tracking-wider text-muted-foreground font-mono">
          {label}
        </span>
        <div className="flex-grow border-t border-border/60"></div>
      </div>
    );
  }

  return (
    <div
      className={cn("w-full border-t border-border/60 my-4 sm:my-6", className)}
      {...props}
    />
  );
}
