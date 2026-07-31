"use client";

import * as React from "react";
import { QuickActionCard } from "@/components/common/quick-action-card";
import { MOCK_QUICK_ACTIONS } from "@/constants/mock-data";
import { SectionWrapper } from "@/components/layout/section-wrapper";

export function QuickActionsPanel() {
  return (
    <SectionWrapper title="Quick Actions" subtitle="Shortcuts for common hostel operations">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {MOCK_QUICK_ACTIONS.map((action) => (
          <QuickActionCard key={action.id} action={action} />
        ))}
      </div>
    </SectionWrapper>
  );
}
