"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Icons, Icon } from "@/lib/icons";
import { scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: Icon;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "Koi kharcha abhi tak add nahi hua.",
  description = "Jab bhi aap ya aapka koi roommate expense add karega, to wo yahan dikhega.",
  icon: IconComponent = Icons.receipt,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center sm:p-12 bg-surface/30"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border/60 text-muted-foreground shadow-subtle mb-4">
          <IconComponent className="h-7 w-7 text-muted-foreground/80" />
        </div>

        <h3 className="heading-md font-heading text-foreground font-semibold text-base sm:text-lg">
          {title}
        </h3>

        <p className="caption mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {action && <div className="mt-6">{action}</div>}
      </motion.div>
    </div>
  );
}
