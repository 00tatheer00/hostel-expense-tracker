"use client";

import * as React from "react";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Application Settings"
        subtitle="Configure room preferences, theme, and landing page defaults."
        badge={
          <Badge variant="outline" className="font-mono text-xs">
            Preferences
          </Badge>
        }
      />

      <SettingsCard />
    </PageWrapper>
  );
}
