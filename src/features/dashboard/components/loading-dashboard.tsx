"use client";

import * as React from "react";
import { LoadingState } from "@/components/common/loading-state";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ContentWrapper } from "@/components/layout/content-wrapper";

export function LoadingDashboard() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <LoadingState type="stats" />
        <LoadingState type="list" count={6} />
      </ContentWrapper>
    </PageWrapper>
  );
}
