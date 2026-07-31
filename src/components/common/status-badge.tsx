import * as React from "react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: "Settled" | "Pending" | "Active" | "Admin";
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config = {
    Settled: {
      variant: "success" as const,
      icon: Icons.checkCircle,
      label: "Settled",
    },
    Pending: {
      variant: "warning" as const,
      icon: Icons.clock,
      label: "Pending",
    },
    Active: {
      variant: "outline" as const,
      icon: Icons.users,
      label: "Active",
    },
    Admin: {
      variant: "default" as const,
      icon: Icons.shield,
      label: "Admin",
    },
  };

  const current = config[status];
  const Icon = current.icon;

  return (
    <Badge
      variant={current.variant}
      className={cn("gap-1 font-mono text-[11px] font-medium py-0.5 px-2", className)}
      {...props}
    >
      <Icon className="h-3 w-3" />
      <span>{current.label}</span>
    </Badge>
  );
}
