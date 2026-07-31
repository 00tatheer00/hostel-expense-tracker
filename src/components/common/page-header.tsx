import * as React from "react";
import { PageTitle, PageTitleProps } from "./page-title";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends PageTitleProps {
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  action,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/50 mb-6 sm:mb-8",
        className
      )}
      {...props}
    >
      <PageTitle title={title} subtitle={subtitle} badge={badge} />
      {action && <div className="flex items-center space-x-3">{action}</div>}
    </div>
  );
}
