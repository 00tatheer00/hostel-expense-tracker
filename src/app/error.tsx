"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("KamraKhata runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <Card className="max-w-md w-full p-6 text-center space-y-4 border border-rose-500/20 bg-card shadow-card">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <Icons.alertCircle className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h2 className="font-heading text-xl font-bold">Something went wrong</h2>
          <p className="caption text-xs text-muted-foreground">
            An unexpected error occurred while loading this page.
          </p>
        </div>

        {error.message && (
          <div className="p-3 rounded-lg bg-surface/50 border border-border/40 text-xs font-mono text-muted-foreground truncate">
            {error.message}
          </div>
        )}

        <div className="pt-2 flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="flex-1 text-xs"
          >
            Go Home
          </Button>
          <Button
            onClick={() => reset()}
            className="flex-1 text-xs font-semibold"
          >
            Try Again
          </Button>
        </div>
      </Card>
    </div>
  );
}
