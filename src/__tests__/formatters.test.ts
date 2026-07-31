import { formatCurrency, formatDate } from "../utils/formatters";

describe("Formatter Utility Unit Tests", () => {
  test("formatCurrency formats numerical amounts into INR currency string", () => {
    const formatted = formatCurrency(1250);
    expect(formatted).toContain("1,250");
  });

  test("formatDate returns valid formatted date string", () => {
    const formatted = formatDate("2026-07-31T10:00:00Z");
    expect(formatted.length).toBeGreaterThan(0);
  });
});
