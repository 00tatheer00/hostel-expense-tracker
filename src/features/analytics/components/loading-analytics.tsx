"use client";

import * as React from "react";
import { LoadingState } from "@/components/common/loading-state";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ContentWrapper } from "@/components/layout/content-wrapper";

export function LoadingAnalytics() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <LoadingState type="stats" />
        <LoadingState type="card" />
        <LoadingState type="card" />
      </ContentWrapper>
    </PageWrapper>
  );
}
