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
        <h1 className="heading-lg">{title}</h1>
        {badge && <div>{badge}</div>}
      </div>
      {subtitle && <p className="caption text-sm">{subtitle}</p>}
    </div>
  );
}
