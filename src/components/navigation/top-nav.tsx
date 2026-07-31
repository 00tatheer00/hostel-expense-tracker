"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/navigation";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Container } from "@/components/layout/container";
import { Icons } from "@/lib/icons";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TopNav() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  // Do not render top navigation on login page
  if (pathname === "/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors">
      <Container size="lg">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Room Title */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-subtle transition-transform group-hover:scale-105">
              <Icons.building className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                {siteConfig.name}
              </span>
              <span className="caption text-[11px] font-mono text-muted-foreground -mt-0.5">
                {siteConfig.roomNumber} • {siteConfig.totalRoommates} Roommates
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 border border-border/40 rounded-full px-3 py-1 bg-surface/50">
            {NAV_ITEMS.map((item) => {
              const Icon = Icons[item.icon] || Icons.dashboard;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-background text-foreground shadow-subtle border border-border/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface/80"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle & Authenticated User Profile */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-2 border-l border-border/60 pl-3 ml-1">
                <Avatar name={user.name} size="sm" />
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-semibold text-foreground leading-none">
                    {user.name}
                  </span>
                  <span className="caption text-[10px] text-muted-foreground leading-none mt-0.5">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  disabled={isLoading}
                  className="h-8 w-8 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 ml-1"
                  title="Sign Out"
                >
                  <Icons.logout className="h-4 w-4" />
                  <span className="sr-only">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="text-xs font-medium">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
