"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Container } from "@/components/layout/container";
import { Icons } from "@/lib/icons";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  // Hide top navigation completely when unauthenticated or on login/register pages
  if (!user || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors md:hidden">
      <Container size="lg">
        <div className="flex h-14 items-center justify-between">
          {/* Logo & Room Title */}
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-subtle">
              <Icons.building className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-base font-bold tracking-tight text-foreground">
                {siteConfig.name}
              </span>
              <span className="caption text-[10px] font-mono text-muted-foreground -mt-0.5">
                {siteConfig.roomNumber} • Al Syed Hostel
              </span>
            </div>
          </Link>

          {/* Right Actions: Theme Toggle & User Avatar */}
          <div className="flex items-center space-x-2">
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
