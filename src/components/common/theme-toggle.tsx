"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 opacity-0">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-9 w-9 rounded-lg transition-colors hover:bg-surface text-muted-foreground hover:text-foreground"
      aria-label="Toggle light and dark theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Icons.sun className="h-4 w-4 transition-transform duration-200 rotate-0 hover:rotate-45 text-amber-400" />
      ) : (
        <Icons.moon className="h-4 w-4 transition-transform duration-200 rotate-0 hover:-rotate-12 text-slate-700" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
