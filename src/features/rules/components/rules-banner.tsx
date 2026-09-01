"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RulesBannerProps {
  className?: string;
  variant?: "card" | "compact" | "pill";
}

export function RulesBanner({ className, variant = "card" }: RulesBannerProps) {
  const [dismissed, setDismissed] = React.useState(false);
  const [hasAcknowledged, setHasAcknowledged] = React.useState(false);

  React.useEffect(() => {
    try {
      const ack = localStorage.getItem("hostel_rules_acknowledged_v1");
      if (ack === "true") {
        setHasAcknowledged(true);
      }
      const isDismissed = sessionStorage.getItem("hostel_rules_banner_dismissed");
      if (isDismissed === "true") {
        setDismissed(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("hostel_rules_banner_dismissed", "true");
    } catch {}
  };

  if (dismissed) {
    return null;
  }

  // Pill variant for headers/tickers
  if (variant === "pill") {
    return (
      <Link
        href="/rules"
        className={cn(
          "group relative inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border",
          "bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-indigo-500/15 border-amber-500/40 hover:border-amber-500 text-foreground",
          className
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="truncate">✨ <strong>Hostel Rules:</strong> 19 New Guidelines</span>
        <Icons.chevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
      </Link>
    );
  }

  // Full Card Banner (Dashboard top notice)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn(
          "relative overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-lg transition-all",
          "border-amber-500/40 dark:border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 dark:from-amber-950/30 dark:via-rose-950/20 dark:to-indigo-950/30",
          className
        )}
      >
        {/* Ambient Glowing Background Effect */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-rose-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Icon & Text Content */}
          <div className="flex items-start space-x-3.5">
            {/* Blinking / Pulsing Icon Box */}
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600 text-white shadow-md shadow-amber-500/20">
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-90"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-white dark:border-slate-900"></span>
              </span>
              <Icons.rules className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-500/40 text-[10px] font-mono font-black uppercase tracking-wider gap-1.5"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                  </span>
                  <span>✨ NEW NOTICE</span>
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                  Al Syed Hostel • Room 14
                </span>
              </div>

              <h3 className="font-heading text-sm sm:text-base font-extrabold tracking-tight text-foreground">
                🏠 Hostel Rules & Guidelines (19 Golden Points)
              </h3>

              <p className="caption text-xs sm:text-sm text-foreground/80 max-w-2xl leading-relaxed">
                Hostel ko peacefully, clean aur discipline ke sath chalane ke liye 19 basic adab aur responsibilities add kar di gayi hain. Tamam roommates lazmi read karein.
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 shrink-0 self-end md:self-center w-full md:w-auto">
            <Link href="/rules" className="flex-1 md:flex-initial">
              <Button
                size="sm"
                className="w-full md:w-auto bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 hover:from-amber-700 hover:via-rose-700 hover:to-indigo-700 text-white font-bold gap-2 shadow-md shadow-indigo-500/20 text-xs sm:text-sm h-9 px-4"
              >
                <Icons.rules className="h-4 w-4 shrink-0" />
                <span>Read Full Rules</span>
                <Icons.arrowUpRight className="h-3.5 w-3.5 shrink-0" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              title="Dismiss for now"
              className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Icons.x className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
