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

  // 2. Authenticated (Roommate Portal Mode): Clean Light Theme + Ambient Soft Mesh + Fixed Side Panel + Glassmorphism
  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-foreground selection:bg-muted overflow-x-hidden">
      {/* Soft Ambient Glowing Gradient Mesh Background (Ultra-lightweight GPU-friendly radial gradients) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-45 dark:opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.12) 0, transparent 40%),
            radial-gradient(circle at 90% 35%, rgba(16, 185, 129, 0.10) 0, transparent 45%),
            radial-gradient(circle at 30% 90%, rgba(139, 92, 246, 0.08) 0, transparent 45%)
          `,
        }}
      />

      {/* Fixed Desktop Left Side Panel */}
      <SidebarNav />

      {/* 4. Main Content Area with md:pl-64 Offset for Fixed Sidebar */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 md:pl-64">
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
