import { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    mobileTitle: "Dashboard",
    href: "/",
    icon: "dashboard",
  },
  {
    title: "Approvals",
    mobileTitle: "Approvals",
    href: "/approvals",
    icon: "clock",
  },
  {
    title: "Recent Purchases",
    mobileTitle: "Expenses",
    href: "/expenses",
    icon: "expenses",
  },
  {
    title: "Settlements",
    mobileTitle: "Settlements",
    href: "/settlements",
    icon: "wallet",
  },
  {
    title: "Spending Audit",
    mobileTitle: "Analytics",
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
