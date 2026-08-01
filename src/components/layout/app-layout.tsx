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

  // 2. Authenticated (Roommate Portal Mode): Animated Mesh Backdrop + Desktop Side Panel + Mobile Bottom Tab Bar
  return (
    <div className="relative min-h-screen flex bg-background text-foreground selection:bg-muted overflow-x-hidden">
      {/* Animated Ambient Gradient Mesh & Glass Orbs Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-70 dark:opacity-50">
        <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/10 blur-[100px] animate-mesh" />
        <div className="absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-br from-emerald-500/25 via-teal-500/20 to-cyan-500/10 blur-[120px] animate-mesh" style={{ animationDelay: "-8s" }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-violet-600/10 blur-[130px] animate-float" style={{ animationDelay: "-4s" }} />
      </div>

      {/* Desktop Left Side Panel */}
      <SidebarNav />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
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
