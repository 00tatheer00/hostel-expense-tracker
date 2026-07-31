import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <Card className="max-w-md w-full p-6 text-center space-y-4 border border-border/80 bg-card shadow-card">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface border border-border/60 text-muted-foreground">
          <Icons.info className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <span className="numeric text-3xl font-bold font-mono text-primary">404</span>
          <h2 className="font-heading text-xl font-bold">Page Not Found</h2>
          <p className="caption text-xs text-muted-foreground">
            Yeh page exist nahi karta ya remove kar diya gaya hai.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button className="w-full text-xs font-semibold shadow-subtle gap-1.5">
              <Icons.home className="h-4 w-4" />
              <span>Back to Room Dashboard</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
