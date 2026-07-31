"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export function DashboardHeader() {
  return (
    <PageHeader
      title="Hostel Dashboard"
      subtitle="Overview of Room 304 shared expenses and live roommate balance settlements."
      badge={
        <Badge variant="success" className="font-mono text-xs gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Room Live</span>
        </Badge>
      }
      action={
        <Link href="/expenses/new">
          <Button className="gap-2 shadow-subtle font-semibold">
            <Icons.plus className="h-4 w-4" />
            <span>Add Expense</span>
          </Button>
        </Link>
      }
    />
  );
}
