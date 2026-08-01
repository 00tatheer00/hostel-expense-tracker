"use client";

import { useAuth } from "@/hooks/use-auth";
import { PublicLayout } from "@/components/layout/public-layout";
import { LandingHero } from "@/components/landing/landing-hero";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-muted-foreground">Loading Room 14 Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <PublicLayout>
        <LandingHero />
      </PublicLayout>
    );
  }

  return <DashboardShell />;
}
