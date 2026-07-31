import { SettlementAlgorithmService } from "../services/settlement-algorithm.service";
import { UserBalanceSummary } from "../types/database";

describe("SettlementAlgorithmService Unit Tests", () => {
  const algorithm = new SettlementAlgorithmService();

  test("generates minimal payments required to resolve room debt", () => {
    const mockBalances: UserBalanceSummary[] = [
      {
        user: { id: "u-1", name: "Ali", email: "ali@kamrakhata.internal", avatar_color: "amber", theme: "light", created_at: "" },
        totalPaid: 600,
        totalOwed: 0,
        totalSettledPaid: 0,
        totalSettledReceived: 0,
        netBalance: 600,
        status: "Gets Back",
      },
      {
        user: { id: "u-2", name: "Waheed", email: "waheed@kamrakhata.internal", avatar_color: "blue", theme: "light", created_at: "" },
        totalPaid: 0,
        totalOwed: 300,
        totalSettledPaid: 0,
        totalSettledReceived: 0,
        netBalance: -300,
        status: "Owes",
      },
      {
        user: { id: "u-3", name: "Usman", email: "usman@kamrakhata.internal", avatar_color: "emerald", theme: "light", created_at: "" },
        totalPaid: 0,
        totalOwed: 300,
        totalSettledPaid: 0,
        totalSettledReceived: 0,
        netBalance: -300,
        status: "Owes",
      },
    ];

    const optimal = algorithm.computeOptimalSettlements(mockBalances);

    expect(optimal.length).toBe(2);
    expect(optimal[0].fromUser.name).toBe("Waheed");
    expect(optimal[0].toUser.name).toBe("Ali");
    expect(optimal[0].amount).toBe(300);

    expect(optimal[1].fromUser.name).toBe("Usman");
    expect(optimal[1].toUser.name).toBe("Ali");
    expect(optimal[1].amount).toBe(300);
  });

  test("returns empty array when all net balances are zero", () => {
    const mockBalances: UserBalanceSummary[] = [
      {
        user: { id: "u-1", name: "Ali", email: "ali@kamrakhata.internal", avatar_color: "amber", theme: "light", created_at: "" },
        totalPaid: 100,
        totalOwed: 100,
        totalSettledPaid: 0,
        totalSettledReceived: 0,
        netBalance: 0,
        status: "Settled",
      },
    ];

    const optimal = algorithm.computeOptimalSettlements(mockBalances);
    expect(optimal.length).toBe(0);
  });
});
