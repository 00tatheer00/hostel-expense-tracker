"use client";

import * as React from "react";
import { QuickActionCard } from "@/components/common/quick-action-card";
import { QuickActionItem } from "@/types";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { siteConfig } from "@/config/site";

export function QuickActions() {
  const actions: QuickActionItem[] = [
    {
      id: "qa-add",
      title: "Add Expense",
      description: "Record a new room purchase or bill",
      icon: "plus",
      href: "/expenses/new",
      disabled: false,
    },
    {
      id: "qa-view",
      title: "View All Expenses",
      description: "Full transaction history & splits",
      icon: "expenses",
      href: "/expenses",
      disabled: false,
    },
    {
      id: "qa-settle",
      title: "Khaata Safaya",
      description: "Settle room balances & repayments",
      icon: "wallet",
      href: "/settlements/new",
      disabled: false,
    },
    {
      id: "qa-analytics",
      title: "Analytics & Trends",
      description: "Category breakdown & spending graphs",
      icon: "analytics",
      href: "/analytics",
      disabled: false,
    },
  ];

  return (
    <SectionWrapper title="Quick Actions" subtitle={`Shortcuts for common ${siteConfig.roomNumber} operations`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <QuickActionCard key={action.id} action={action} />
        ))}
      </div>
    </SectionWrapper>
  );
}
