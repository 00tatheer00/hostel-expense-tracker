import { UserBalanceSummary, SuggestedSettlement } from "@/types/database";
import { formatCurrency } from "@/utils/formatters";

export class SettlementAlgorithmService {
  /**
   * Smart Settlement Algorithm (Greedy Minimum Cash Flow)
   * Converts N roommate net balances into the minimum possible transactions.
   */
  computeOptimalSettlements(
    balances: UserBalanceSummary[]
  ): SuggestedSettlement[] {
    // 1. Separate debtors (netBalance < 0) and creditors (netBalance > 0)
    const debtors: { summary: UserBalanceSummary; amount: number }[] = [];
    const creditors: { summary: UserBalanceSummary; amount: number }[] = [];

    balances.forEach((b) => {
      const net = Math.round(b.netBalance * 100) / 100;
      if (net < -0.01) {
        debtors.push({ summary: b, amount: Math.abs(net) });
      } else if (net > 0.01) {
        creditors.push({ summary: b, amount: net });
      }
    });

    // Sort to optimize matching
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements: SuggestedSettlement[] = [];

    let i = 0; // debtor index
    let j = 0; // creditor index

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      // Settle the minimum of what debtor owes and creditor receives
      const settleAmount = Math.min(debtor.amount, creditor.amount);
      const roundedAmount = Math.round(settleAmount * 100) / 100;

      if (roundedAmount > 0) {
        settlements.push({
          fromUser: debtor.summary.user,
          toUser: creditor.summary.user,
          amount: roundedAmount,
          formattedAmount: formatCurrency(roundedAmount),
        });
      }

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;

      if (Math.abs(debtor.amount) < 0.01) {
        i++;
      }
      if (Math.abs(creditor.amount) < 0.01) {
        j++;
      }
    }

    return settlements;
  }
}
