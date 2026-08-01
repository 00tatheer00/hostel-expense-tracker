import { Roommate, StatCardData, QuickActionItem } from "@/types";

export const MOCK_ROOMMATES: Roommate[] = [
  {
    id: "rm-1",
    name: "Waheed",
    role: "Room Admin",
    isCurrentUser: true,
    status: "Settled",
    netBalance: 0,
  },
  {
    id: "rm-2",
    name: "Usman",
    role: "Roommate",
    isCurrentUser: false,
    status: "Settled",
    netBalance: 0,
  },
  {
    id: "rm-3",
    name: "Ali",
    role: "Roommate",
    isCurrentUser: false,
    status: "Settled",
    netBalance: 0,
  },
  {
    id: "rm-4",
    name: "Aman",
    role: "Roommate",
    isCurrentUser: false,
    status: "Settled",
    netBalance: 0,
  },
  {
    id: "rm-5",
    name: "Sadam",
    role: "Roommate",
    isCurrentUser: false,
    status: "Settled",
    netBalance: 0,
  },
  {
    id: "rm-6",
    name: "Masood",
    role: "Roommate",
    isCurrentUser: false,
    status: "Settled",
    netBalance: 0,
  },
];

export const MOCK_STATS: StatCardData[] = [
  {
    id: "stat-1",
    title: "Current Room Balance",
    value: "Rs. 0",
    subtitle: "Clean state - All settled up",
    icon: "wallet",
    variant: "default",
  },
  {
    id: "stat-2",
    title: "Monthly Spending",
    value: "Rs. 0",
    subtitle: "Total expenses this month",
    icon: "expenses",
    variant: "default",
  },
  {
    id: "stat-3",
    title: "Your Net Share",
    value: "Rs. 0",
    subtitle: "You neither owe nor get back",
    icon: "users",
    variant: "success",
  },
  {
    id: "stat-4",
    title: "Active Roommates",
    value: "6 Roommates",
    subtitle: "Room 14, Al Syed Hostel",
    icon: "building",
    badgeText: "Room 14",
  },
];

export const MOCK_QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "qa-1",
    title: "Add Expense",
    description: "Kharcha record karein",
    icon: "plus",
    href: "#",
    disabled: true,
    badgeText: "Phase 3",
  },
  {
    id: "qa-2",
    title: "View Expenses",
    description: "Sabhi purane expenses dekhein",
    icon: "expenses",
    href: "/expenses",
    disabled: false,
  },
  {
    id: "qa-3",
    title: "View Analytics",
    description: "Monthly breakdown & graphs",
    icon: "analytics",
    href: "/analytics",
    disabled: false,
  },
];
