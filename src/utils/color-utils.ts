/**
 * Generates a consistent background & text color palette based on roommate name
 */
export function generateAvatarColor(name: string): {
  bg: string;
  text: string;
  border: string;
} {
  const colors = [
    {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-500/20",
    },
    {
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-500/20",
    },
    {
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-500/20",
    },
    {
      bg: "bg-purple-500/10 dark:bg-purple-500/20",
      text: "text-purple-700 dark:text-purple-400",
      border: "border-purple-500/20",
    },
    {
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
      text: "text-rose-700 dark:text-rose-400",
      border: "border-rose-500/20",
    },
    {
      bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      text: "text-indigo-700 dark:text-indigo-400",
      border: "border-indigo-500/20",
    },
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Extracts initials from name (e.g. "Aaman Sharma" -> "AS", "Rahul" -> "RA")
 */
export function getInitials(name: string): string {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
