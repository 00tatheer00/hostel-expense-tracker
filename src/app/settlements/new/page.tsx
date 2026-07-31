"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { SettlementForm } from "@/features/settlements/components/settlement-form";
import { useSettlements } from "@/features/settlements/hooks/use-settlements";
import { CreateSettlementInput } from "@/lib/validations/expense";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

function SettlementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { roommates, recordSettlement } = useSettlements();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const initialFromId = searchParams.get("from") || undefined;
  const initialToId = searchParams.get("to") || undefined;
  const rawAmt = searchParams.get("amount");
  const initialAmount = rawAmt ? parseFloat(rawAmt) : undefined;

  const handleSubmit = async (data: CreateSettlementInput) => {
    setIsSubmitting(true);
    try {
      await recordSettlement(data);
      router.push("/settlements");
    } catch (error) {
      console.error("Failed to record settlement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <SettlementForm
        roommates={roommates}
        initialFromId={initialFromId}
        initialToId={initialToId}
        initialAmount={initialAmount}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default function NewSettlementPage() {
  const router = useRouter();

  return (
    <PageWrapper>
      <PageHeader
        title="Record Payment Settlement"
        subtitle="Log a cash or UPI payment between roommates to update balances."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-1.5 text-xs"
          >
            <Icons.chevronRight className="h-3.5 w-3.5 rotate-180" />
            <span>Back</span>
          </Button>
        }
      />

      <React.Suspense
        fallback={
          <div className="max-w-xl mx-auto py-12 text-center text-xs text-muted-foreground">
            Loading settlement form...
          </div>
        }
      >
        <SettlementContent />
      </React.Suspense>
    </PageWrapper>
  );
}
