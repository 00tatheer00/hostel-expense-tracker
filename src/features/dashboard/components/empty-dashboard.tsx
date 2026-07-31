"use client";

import * as React from "react";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export function EmptyDashboard() {
  return (
    <div className="py-8">
      <EmptyState
        title="Koi kharcha abhi tak add nahi hua."
        description="Aap ya aapka koi roommate Room 304 ka naya expense add karega to live room balance, top statistics aur monthly breakdown yahan realtime dikhayi denge."
        icon={Icons.expenses}
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
