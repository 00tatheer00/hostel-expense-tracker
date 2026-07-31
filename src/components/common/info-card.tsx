import * as React from "react";
import { Card } from "@/components/ui/card";
import { Icons, Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: Icon;
  variant?: "info" | "success" | "warning" | "danger";
}

export function InfoCard({
  title,
  description,
  icon: IconComponent = Icons.info,
  variant = "info",
  className,
  ...props
}: InfoCardProps) {
  const variantStyles = {
    info: "border-blue-500/20 bg-blue-500/5 text-blue-900 dark:text-blue-200",
    success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200",
    warning: "border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200",
    danger: "border-rose-500/20 bg-rose-500/5 text-rose-900 dark:text-rose-200",
  };

  const iconStyles = {
    info: "text-blue-600 dark:text-blue-400",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-rose-600 dark:text-rose-400",
  };

  return (
    <Card
      className={cn("p-4 sm:p-5 flex items-start space-x-3.5 border", variantStyles[variant], className)}
      {...props}
    >
      <div className={cn("mt-0.5 shrink-0", iconStyles[variant])}>
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
        <p className="text-xs leading-relaxed opacity-90">{description}</p>
      </div>
    </Card>
  );
}
