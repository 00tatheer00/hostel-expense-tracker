"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/constants/navigation";
import { Icons } from "@/lib/icons";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hide mobile bottom nav on login/register pages or when unauthenticated
  if (pathname === "/login" || pathname === "/register" || !user) {
    return null;
  }

  // Mobile navigation items (filtered for admin vs member)
  const mobileNavItems = NAV_ITEMS.filter((item) => {
    if (item.href === "/admin" || item.href === "/approvals") {
      return user?.role === "Room Admin";
    }
    return true;
  }).slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/80 bg-white/95 dark:bg-card/95 backdrop-blur-lg pb-safe">
      <div className="flex h-16 items-center justify-between px-1 max-w-md mx-auto">
        {mobileNavItems.map((item) => {
          const Icon = Icons[item.icon] || Icons.dashboard;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center py-1.5 min-w-[56px] text-[10px] font-medium transition-colors select-none",
                isActive
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeBottomNav"
                  className="absolute -top-0.5 h-1 w-6 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-xl transition-all",
                  isActive ? "bg-surface text-foreground font-bold" : ""
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="mt-0.5 truncate max-w-[64px] text-center">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
