import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SectionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  noPadding = false,
  className,
  ...props
}: SectionCardProps) {
  return (
    <Card className={cn("overflow-hidden glass-card border border-white/15 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-card/80", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="font-heading text-base font-semibold sm:text-lg">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="mt-1">{description}</CardDescription>
          )}
        </div>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className={cn(noPadding && "p-0 pt-0 sm:pt-0")}>
        {children}
      </CardContent>
    </Card>
  );
}
