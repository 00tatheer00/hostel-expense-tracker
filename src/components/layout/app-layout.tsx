"use client";

import * as React from "react";
import { TopNav } from "@/components/navigation/top-nav";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Container } from "@/components/layout/container";
import { FloatingActionButton } from "@/components/common/floating-action-button";

export interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-muted">
      {/* Desktop Top Navigation Header */}
      <TopNav />

      {/* Main Content Area */}
      <main className="flex-1">
        <Container size="lg">{children}</Container>
      </main>

      {/* Mobile Floating Action Button Placeholder */}
      <FloatingActionButton />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
