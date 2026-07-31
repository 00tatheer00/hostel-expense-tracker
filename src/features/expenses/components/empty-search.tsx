"use client";

import * as React from "react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export interface EmptySearchProps {
  onClear: () => void;
}

export function EmptySearch({ onClear }: EmptySearchProps) {
  return (
    <EmptyState
      title="No matching expenses found."
      description="Aapke search query ya applied filters ke mutabiq koi expense nahi mila. Filter reset karke dobara try karein."
      icon={Icons.info}
      action={
        <Button variant="outline" onClick={onClear} className="gap-2 text-xs">
          <Icons.logout className="h-3.5 w-3.5" />
          <span>Clear Search & Filters</span>
        </Button>
      }
    />
  );
}
