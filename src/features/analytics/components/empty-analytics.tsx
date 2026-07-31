"use client";

import * as React from "react";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export function EmptyAnalytics() {
  return (
    <div className="py-8">
      <EmptyState
        title="Analytics dikhane ke liye pehle kuch expenses add karein."
        description="Jab aap ya aapka koi roommate Room 304 ka kharcha record karega, to category breakdowns, graphs aur personal analytics yahan auto-generate honge."
        icon={Icons.analytics}
        action={
          <Link href="/expenses/new">
            <Button size="lg" className="gap-2 shadow-subtle font-semibold">
              <Icons.plus className="h-5 w-5" />
              <span>Naya Kharcha Jodein</span>
            </Button>
          </Link>
        }
      />
    </div>
  );
}
