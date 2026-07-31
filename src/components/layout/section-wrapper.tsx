import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionWrapper({
  title,
  subtitle,
  action,
  className,
  children,
  ...props
}: SectionWrapperProps) {
  return (
    <section className={cn("space-y-4", className)} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="heading-md font-heading text-foreground">
                {title}
              </h2>
            )}
            {subtitle && <p className="caption text-xs mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
