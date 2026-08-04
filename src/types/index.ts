import { Icons } from "@/lib/icons";

export type IconName = keyof typeof Icons;

export interface NavItem {
  title: string;
  mobileTitle?: string;
  href: string;
  icon: IconName;
  badge?: string | number;
  disabled?: boolean;
}

export interface Roommate {
  id: string;
  name: string;
  role: "Room Admin" | "Roommate";
  avatarUrl?: string;
  isCurrentUser?: boolean;
  status: "Settled" | "Pending" | "Active";
  netBalance: number;
}

export interface StatCardData {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  icon: IconName;
  badgeText?: string;
  variant?: "default" | "success" | "danger" | "warning";
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  href: string;
  disabled?: boolean;
  badgeText?: string;
}
