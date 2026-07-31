/**
 * Formats a numerical amount to Indian Rupee (INR) standard format or custom prefix
 * Example: 1250 -> "Rs. 1,250"
 */
export function formatCurrency(
  amount: number,
  currencySymbol: string = "Rs."
): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);

  return `${currencySymbol} ${formatted}`;
}

/**
 * Formats a Date instance or ISO string to friendly display string
 * Example: "2026-07-31" -> "31 Jul 2026"
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  }
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", options).format(d);
}
