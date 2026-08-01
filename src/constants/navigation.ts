import { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: "dashboard",
  },
  {
    title: "Approvals",
    href: "/approvals",
    icon: "clock",
  },
  {
    title: "Recent Purchases",
    href: "/expenses",
    icon: "expenses",
  },
  {
    title: "Settlements",
    href: "/settlements",
    icon: "wallet",
  },
  {
    title: "Spending Audit",
    href: "/admin?tab=breakdown",
    icon: "analytics",
  },
  {
    title: "Email Reports",
    href: "/admin?tab=reports",
    icon: "sparkles",
  },
  {
    title: "User Guide",
    href: "/guide",
    icon: "help",
  },
  {
    title: "My Profile",
    href: "/profile",
    icon: "profile",
  },
];
