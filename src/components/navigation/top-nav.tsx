"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Container } from "@/components/layout/container";
import { Icons } from "@/lib/icons";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MonthSelector } from "@/components/common/month-selector";
import { cn } from "@/lib/utils";

export function TopNav() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  // Hide top navigation completely when unauthenticated or on login/register pages
  if (!user || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors md:hidden shadow-xs">
      <Container size="lg">
        <div className="flex h-14 items-center justify-between gap-2">
          {/* Logo & Room Title */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden shadow-subtle border border-indigo-500/30">
              <Image src="/logo.png" alt="RoomHesabKitaab Logo" width={32} height={32} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xs font-extrabold tracking-tight text-slate-900 dark:text-foreground truncate max-w-[100px]">
                {siteConfig.name}
              </span>
              <span className="caption text-[9px] font-mono text-slate-500 dark:text-muted-foreground -mt-0.5 font-medium">
                {siteConfig.roomNumber}
              </span>
            </div>
          </Link>

          {/* Center/Right Actions: Rules, Month Selector, Theme Toggle & User Avatar */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Blinking Mobile Rules Button */}
            <Link
              href="/rules"
              className={cn(
                "relative flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-extrabold transition-all border",
                pathname === "/rules"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500 shadow-sm"
                  : "bg-gradient-to-r from-amber-500/15 to-rose-500/15 text-amber-900 dark:text-amber-300 border-amber-500/40 hover:border-amber-500"
              )}
              title="Hostel Rules & Guidelines"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <Icons.rules className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[10px] font-mono uppercase tracking-wider font-black">Rules</span>
            </Link>

            <MonthSelector compact />
            <ThemeToggle />

            {user && (
              <div className="flex items-center space-x-2 border-l border-border/60 pl-2">
                <Avatar name={user.name} size="sm" />
                <span className="text-xs font-bold text-foreground max-w-[90px] truncate">
                  {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  disabled={isLoading}
                  className="h-8 w-8 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400"
                  title="Sign Out"
                >
                  <Icons.logout className="h-4 w-4" />
                  <span className="sr-only">Sign Out</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
