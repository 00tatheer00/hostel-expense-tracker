/**
 * Month Utility & Locking Engine for KamraKhata
 * Handles month boundaries, cutoff rules, and lock states
 */

export interface MonthOption {
  key: string; // e.g. "2026-09", "2026-08", "all"
  label: string; // e.g. "September 2026", "August 2026 (Locked)"
  isLocked: boolean;
  isCurrent: boolean;
  year: number;
  month: number; // 0-indexed (0 = Jan, 7 = Aug, 8 = Sep)
}

// Cutoff timestamp: September 30, 2026 23:59:59.999 (PKT / UTC+5)
// Any expense recorded on or before this cutoff belongs to the locked September/August period.
export const SEPTEMBER_LOCK_CUTOFF_ISO = "2026-09-30T23:59:59.999+05:00";
export const SEPTEMBER_LOCK_CUTOFF_TIMESTAMP = new Date(SEPTEMBER_LOCK_CUTOFF_ISO).getTime();

// Active new month key (October 2026)
export const ACTIVE_MONTH_KEY = "2026-10";
export const LOCKED_MONTH_KEYS = ["2026-08", "2026-09"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Checks if a given timestamp or ISO date string falls in a locked period (September 2026 or prior)
 */
export function isExpenseLocked(createdAt: string | Date | undefined | null): boolean {
  if (!createdAt) return false;
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return false;

  // If date is before or within September 2026
  const dTime = d.getTime();
  if (dTime <= SEPTEMBER_LOCK_CUTOFF_TIMESTAMP) {
    return true;
  }

  // Also lock if Year <= 2026 and Month <= September (0-indexed month index 8)
  const y = d.getFullYear();
  const m = d.getMonth();
  if (y < 2026 || (y === 2026 && m <= 8)) {
    return true;
  }

  return false;
}

/**
 * Checks if a month key is locked (e.g. "2026-08", "2026-09")
 */
export function isMonthLocked(monthKey: string): boolean {
  if (monthKey === "all") return false;
  if (LOCKED_MONTH_KEYS.includes(monthKey)) return true;
  
  // Format: "YYYY-MM"
  const [yearStr, monthStr] = monthKey.split("-");
  const y = parseInt(yearStr, 10);
  const m = parseInt(monthStr, 10); // 1-indexed

  if (!isNaN(y) && !isNaN(m)) {
    if (y < 2026 || (y === 2026 && m <= 9)) {
      return true;
    }
  }

  return false;
}

/**
 * Generates month key from date (format: "YYYY-MM")
 */
export function getMonthKey(date: string | Date = new Date()): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return ACTIVE_MONTH_KEY;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Generates human readable month label
 */
export function getMonthLabel(monthKey: string): string {
  if (monthKey === "all") return "All Time (Sab Mahine)";
  const [yearStr, monthStr] = monthKey.split("-");
  const y = parseInt(yearStr, 10);
  const mIndex = parseInt(monthStr, 10) - 1;

  if (isNaN(y) || isNaN(mIndex) || mIndex < 0 || mIndex > 11) {
    return monthKey;
  }

  const name = MONTH_NAMES[mIndex];
  const isLocked = isMonthLocked(monthKey);
  const isCurrent = monthKey === ACTIVE_MONTH_KEY;

  if (isLocked) {
    return `${name} ${y} (Locked Archive 🔒)`;
  }
  if (isCurrent) {
    return `${name} ${y} (Active 🟢)`;
  }
  return `${name} ${y}`;
}

/**
 * Generates a list of all selectable months based on expense history and active month
 */
export function getAvailableMonthOptions(expenses: { created_at: string }[] = []): MonthOption[] {
  const optionsMap = new Map<string, MonthOption>();

  // 1. Always include Active Month (October 2026)
  optionsMap.set(ACTIVE_MONTH_KEY, {
    key: ACTIVE_MONTH_KEY,
    label: "October 2026 (Active 🟢)",
    isLocked: false,
    isCurrent: true,
    year: 2026,
    month: 9, // October = 9 (0-indexed)
  });

  // 2. Always include September 2026 (Locked Archive)
  optionsMap.set("2026-09", {
    key: "2026-09",
    label: "September 2026 (Locked Archive 🔒)",
    isLocked: true,
    isCurrent: false,
    year: 2026,
    month: 8, // September = 8
  });

  // 3. Always include August 2026 (Locked Archive)
  optionsMap.set("2026-08", {
    key: "2026-08",
    label: "August 2026 (Locked Archive 🔒)",
    isLocked: true,
    isCurrent: false,
    year: 2026,
    month: 7, // August = 7
  });

  // 3. Add any other months present in expenses
  expenses.forEach((e) => {
    if (!e.created_at) return;
    const key = getMonthKey(e.created_at);
    if (!optionsMap.has(key)) {
      const d = new Date(e.created_at);
      const isLocked = isMonthLocked(key);
      const isCurrent = key === ACTIVE_MONTH_KEY;
      optionsMap.set(key, {
        key,
        label: isLocked
          ? `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()} (Locked 🔒)`
          : `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
        isLocked,
        isCurrent,
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }
  });

  // Sort descending by date (newest first)
  const sorted = Array.from(optionsMap.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return sorted;
}

/**
 * Filters items (expenses or settlements) by the selected month
 */
export function filterItemsByMonth<T extends { created_at: string }>(
  items: T[],
  selectedMonth: string
): T[] {
  if (!selectedMonth || selectedMonth === "all") {
    return items;
  }

  return items.filter((item) => {
    if (!item.created_at) return false;
    const itemKey = getMonthKey(item.created_at);
    return itemKey === selectedMonth;
  });
}
