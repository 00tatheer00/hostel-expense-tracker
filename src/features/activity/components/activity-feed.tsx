"use client";

import * as React from "react";
import { SectionCard } from "@/components/common/section-card";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/utils/formatters";
import { Icons } from "@/lib/icons";

export interface ActivityItem {
  id: string;
  userName: string;
  actionText: string;
  amountText?: string;
  timestamp: string;
  type: "expense_created" | "expense_edited" | "settlement_recorded";
}

export interface ActivityFeedProps {
  activities?: ActivityItem[];
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    userName: "Ali",
    actionText: "added an expense for Grocery & Provisions",
    amountText: "Rs. 2,500",
    timestamp: "2 hours ago",
    type: "expense_created",
  },
  {
    id: "act-2",
    userName: "Waheed",
    actionText: "recorded settlement payment to Ali",
    amountText: "Rs. 500",
    timestamp: "5 hours ago",
    type: "settlement_recorded",
  },
  {
    id: "act-3",
    userName: "Usman",
    actionText: "added an expense for WiFi Internet Bill",
    amountText: "Rs. 1,200",
    timestamp: "1 day ago",
    type: "expense_created",
  },
  {
    id: "act-4",
    userName: "Aman",
    actionText: "edited details for Electricity Bill",
    amountText: "Rs. 1,800",
    timestamp: "2 days ago",
    type: "expense_edited",
  },
];

export function ActivityFeed({ activities = DEFAULT_ACTIVITIES }: ActivityFeedProps) {
  return (
    <SectionCard title="Recent Activity Feed" description="Live timeline of Room 304 room actions">
      <div className="space-y-3 pt-1">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-surface/50 transition-all text-xs"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <Avatar name={item.userName} size="sm" />
              <div className="truncate space-y-0.5">
                <span className="text-xs font-bold text-foreground">
                  {item.userName}
                </span>{" "}
                <span className="text-muted-foreground">{item.actionText}</span>
                {item.amountText && (
                  <span className="numeric font-bold font-mono text-foreground ml-1">
                    ({item.amountText})
                  </span>
                )}
              </div>
            </div>

            <span className="caption text-[11px] font-mono text-muted-foreground shrink-0 pl-2">
              {item.timestamp}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
