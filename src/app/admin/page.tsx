"use client";

import * as React from "react";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { AdminApprovalPanel } from "@/features/admin/components/admin-approval-panel";
import { useAuth } from "@/hooks/use-auth";
import { siteConfig } from "@/config/site";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/lib/icons";

export default function AdminPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  // Access control check for Room Admin role
  if (!user || user.role !== "Room Admin") {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto my-12 text-center">
          <Card className="border-rose-500/30 bg-rose-500/5 shadow-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <Icons.shieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>
              <p className="text-xs text-muted-foreground">
                Yeh Admin Panel srf Room Admin ke liye hai. Room members ko yahan access nahi mil sakta.
              </p>
            </div>
            <Link href="/" className="inline-block">
              <Button size="sm" className="bg-primary text-primary-foreground font-semibold gap-2">
                <Icons.arrowLeft className="h-4 w-4" />
                <span>Wapis Home Par Jayein</span>
              </Button>
            </Link>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Admin Control Panel"
        subtitle={`${siteConfig.roomNumber}, ${siteConfig.hostelName} - Approvals, Hisaab Summary & Balance Adjustments.`}
      />

      <AdminApprovalPanel />
    </PageWrapper>
  );
}
