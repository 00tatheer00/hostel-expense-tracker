import { ExpenseWithSplits, UserBalanceSummary } from "@/types/database";

/**
 * Calculates equal splits for N participants rounded to 2 decimal places with remainder adjustment
 */
export function calculateSplit(totalAmount: number, count: number): number[] {
  if (count <= 0) return [];
  const baseShare = Math.floor((totalAmount / count) * 100) / 100;
  const remainder = Math.round((totalAmount - baseShare * count) * 100) / 100;

  const shares = new Array(count).fill(baseShare);
  if (remainder > 0) {
    shares[0] = Math.round((shares[0] + remainder) * 100) / 100;
  }
  return shares;
}

/**
 * Calculates percentage ratio safely
 */
export function calculatePercentage(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 1000) / 10;
}

/**
 * Groups expenses by category
 */
export function groupExpensesByCategory(
  expenses: ExpenseWithSplits[]
): Record<string, ExpenseWithSplits[]> {
  return expenses.reduce((acc, curr) => {
    const cat = curr.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(curr);
    return acc;
  }, {} as Record<string, ExpenseWithSplits[]>);
}

/**
 * Sorts roommate balances: Creditors (gets back most) -> Debtors (owes most)
 */
export function sortBalancesByNet(
  balances: UserBalanceSummary[]
): UserBalanceSummary[] {
  return [...balances].sort((a, b) => b.netBalance - a.netBalance);
}
