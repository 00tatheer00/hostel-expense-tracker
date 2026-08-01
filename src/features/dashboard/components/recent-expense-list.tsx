"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/common/section-card";
import { RecentExpenseCard } from "./recent-expense-card";
import { EmptyState } from "@/components/common/empty-state";
import { ExpenseWithSplits } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { staggerContainer, listItemAnimation } from "@/lib/motion";
import { InfoPopover } from "@/components/common/info-popover";

export interface RecentExpenseListProps {
  expenses: ExpenseWithSplits[];
}

export function RecentExpenseList({ expenses }: RecentExpenseListProps) {
  return (
    <SectionCard
      title={
        <span className="flex items-center">
          <span>Aakhri Daily Kharchay</span>
          <InfoPopover
            title="Recent Daily Kharcha"
            explanation="Room 14 mein hone wale halia kharchon ki list (doodh, roti, sabzi, grocery, wagaira)."
          />
        </span>
      }
      description="Room 14 Al Syed Hostel ke recent kharchay"
      action={
        expenses.length > 0 ? (
          <Link href="/expenses">
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground hover:text-foreground">
              <span>Sabhi Dekhein</span>
              <Icons.chevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        ) : null
      }
    >
      {expenses.length === 0 ? (
        <EmptyState
          title="Abhi tak koi kharcha add nahi hua."
          description="Aap ya aap ka koi bhi roommate naya kharcha add karega toh woh yahan live dikhayi dega."
          icon={Icons.expenses}
          action={
            <Link href="/expenses/new">
              <Button className="gap-2 shadow-subtle font-semibold">
                <Icons.plus className="h-4 w-4" />
                <span>Naya Kharcha Jodein</span>
              </Button>
            </Link>
          }
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-2.5 pt-1"
        >
          {expenses.map((expense) => (
            <motion.div key={expense.id} variants={listItemAnimation}>
              <RecentExpenseCard expense={expense} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </SectionCard>
  );
}
