"use client";

import * as React from "react";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { AdminApprovalPanel } from "@/features/admin/components/admin-approval-panel";
import { useAuth } from "@/hooks/use-auth";
import { siteConfig } from "@/config/site";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <PageWrapper>
      <PageHeader
        title="Admin Panel & Approvals"
        subtitle={`${siteConfig.roomNumber}, ${siteConfig.hostelName} registration request approvals.`}
      />

      <AdminApprovalPanel />
    </PageWrapper>
  );
}
