"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageWrapper({ className, children, ...props }: PageWrapperProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="py-6 sm:py-8 space-y-6 sm:space-y-8 pb-24 md:pb-12"
      >
        {children}
      </motion.div>
    </div>
  );
}
