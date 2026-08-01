import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
}

export function PageTitle({
  title,
  subtitle,
  badge,
  className,
  ...props
}: PageTitleProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      <div className="flex items-center space-x-2.5">
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-foreground">
          {title}
        </h1>
        {badge && <div>{badge}</div>}
      </div>
      {subtitle && (
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-muted-foreground mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}
