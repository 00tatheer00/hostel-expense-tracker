"use client";

import * as React from "react";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { SectionCard } from "@/components/common/section-card";
import { ProfileCard } from "@/features/profile/components/profile-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { Icons } from "@/lib/icons";
import { siteConfig } from "@/config/site";

export default function ProfilePage() {
  const { user } = useAuth();
  const { roommates } = useExpenses();

  return (
    <PageWrapper>
      <PageHeader
        title="Roommate Profile"
        subtitle={`${siteConfig.roomNumber}, ${siteConfig.hostelName} session and preferences.`}
      />

      <div className="space-y-6">
        {/* Profile Details & Financial Metrics */}
        <ProfileCard />

        {/* Room Details & Registered Roommates */}
        <SectionCard
          title={`${siteConfig.roomNumber} Registered Roommates`}
          description={`${siteConfig.hostelName} active group members`}
        >
          <div className="divide-y divide-border/60">
            {roommates.length === 0 ? (
              <p className="text-xs text-muted-foreground py-3">No other registered roommates yet.</p>
            ) : (
              roommates.map((rm) => {
                const isSelf = user?.name && rm.name ? user.name.toLowerCase() === rm.name.toLowerCase() : false;
                return (
                  <div key={rm.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar name={rm.name} size="sm" />
                      <div>
                        <span className="text-sm font-semibold">{rm.name}</span>
                        <p className="caption text-xs">Roommate</p>
                      </div>
                    </div>
                    <Badge
                      variant={isSelf ? "default" : "secondary"}
                      className="text-[10px] font-mono"
                    >
                      {isSelf ? "Active User" : "Roommate"}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </SectionCard>

        {/* Preferences */}
        <SectionCard title="Preferences" description="Application dark/light theme">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-3">
              <Icons.sparkles className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="text-sm font-medium">Theme Mode</span>
                <p className="caption text-xs">Switch between light warm neutral and dark mode</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </SectionCard>
      </div>
    </PageWrapper>
  );
}
