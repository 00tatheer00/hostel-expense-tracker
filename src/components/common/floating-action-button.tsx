"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";

export function FloatingActionButton() {
  return (
    <motion.div
      className="fixed bottom-20 right-4 z-40 md:hidden"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.92 }}
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground p-0 flex items-center justify-center border border-border/40 opacity-90 hover:opacity-100"
        title="Add Expense (Phase 2)"
        disabled
      >
        <Icons.plus className="h-6 w-6" />
        <span className="sr-only">Add Expense Placeholder</span>
      </Button>
    </motion.div>
  );
}
