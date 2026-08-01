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
      {/* Soft Ambient Glowing Gradient Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50 dark:opacity-40">
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-pink-400/10 blur-[100px] animate-mesh" />
        <div className="absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-emerald-400/20 via-teal-400/15 to-cyan-400/10 blur-[110px] animate-mesh" style={{ animationDelay: "-8s" }} />
        <div className="absolute -bottom-[15%] left-[20%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-tr from-blue-400/15 via-indigo-400/15 to-violet-400/10 blur-[120px] animate-float" style={{ animationDelay: "-4s" }} />
      </div>

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
