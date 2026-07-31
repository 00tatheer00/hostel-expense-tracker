"use client";

import * as React from "react";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export function SettlementEmptyState() {
  return (
    <EmptyState
      title="Koi settlement abhi tak record nahi hui."
      description="Jab roommates aapas me net dues clear karke payment karenge, to wo yahan settlement history me dikhega."
      icon={Icons.wallet}
      action={
        <Link href="/settlements/new">
          <Button className="gap-2 shadow-subtle bg-emerald-700 hover:bg-emerald-800 text-white">
            <Icons.checkCircle className="h-4 w-4" />
            <span>Record Payment</span>
          </Button>
        </Link>
      }
    />
  );
}
