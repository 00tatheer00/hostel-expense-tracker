"use client";

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { TopNav } from "@/components/navigation/top-nav";
import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Container } from "@/components/layout/container";
import { FloatingActionButton } from "@/components/common/floating-action-button";

export interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();

  // 1. Unauthenticated (Landing Page Mode): Clean standalone view with ZERO navigation tabs
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground selection:bg-muted">
        <main className="w-full flex-1 flex flex-col items-center justify-center">
          {children}
        </main>
      </div>
    );
  }

  // 2. Authenticated (Roommate Portal Mode): Desktop Side Panel + Mobile Bottom Tab Bar
  return (
    <div className="relative min-h-screen flex bg-background text-foreground selection:bg-muted">
      {/* Desktop Left Side Panel */}
      <SidebarNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Navigation Header */}
        <TopNav />

        {/* Page Content */}
        <main className="flex-1">
          <Container size="lg">{children}</Container>
        </main>

        {/* Mobile Floating Action Button */}
        <FloatingActionButton />

        {/* Mobile Bottom Tab Navigation Bar */}
        <BottomNav />
      </div>
    </div>
  );
}
