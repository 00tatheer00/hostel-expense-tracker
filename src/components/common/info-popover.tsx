"use client";

import * as React from "react";
import { Icons } from "@/lib/icons";

export interface InfoPopoverProps {
  title: string;
  explanation: string;
}

export function InfoPopover({ title, explanation }: InfoPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block ml-1.5 align-middle">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label={`Info for ${title}`}
        className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <Icons.info className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl z-50 text-left text-xs space-y-1 animate-in fade-in duration-150">
          <div className="flex items-center space-x-1 font-bold text-foreground">
            <Icons.info className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>ℹ️ {title}</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
