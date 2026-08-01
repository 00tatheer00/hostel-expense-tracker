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
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-label={`Info for ${title}`}
        className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 dark:text-indigo-300 transition-all text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 shrink-0 cursor-pointer"
      >
        <Icons.info className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for easy closing on mobile and desktop */}
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />

          {/* Floating Dialog Box (Fixed Positioned to avoid overflow-hidden clipping on mobile & desktop) */}
          <div
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto p-5 rounded-2xl border border-indigo-500/50 bg-slate-900 text-white shadow-2xl z-[101] text-left space-y-3 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between font-bold text-sm text-indigo-300 border-b border-indigo-500/30 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 font-bold">
                  <Icons.info className="h-4 w-4" />
                </span>
                <span>{title}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20"
              >
                <Icons.x className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-xs text-indigo-100/90 leading-relaxed font-sans">
              {explanation}
            </p>

            <div className="pt-1 text-right">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95 transition-transform"
              >
                Samajh Aa Gaya 👍
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
