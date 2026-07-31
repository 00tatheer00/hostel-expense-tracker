"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { UserRow } from "@/types/database";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface MemberSelectorProps {
  members: UserRow[];
  selectedUserIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function MemberSelector({
  members,
  selectedUserIds,
  onChange,
}: MemberSelectorProps) {
  const toggleMember = (id: string) => {
    if (selectedUserIds.includes(id)) {
      // Don't deselect if it's the last selected member
      if (selectedUserIds.length <= 1) return;
      onChange(selectedUserIds.filter((mId) => mId !== id));
    } else {
      onChange([...selectedUserIds, id]);
    }
  };

  const selectAll = () => {
    onChange(members.map((m) => m.id));
  };

  const isAllSelected = members.length > 0 && selectedUserIds.length === members.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Split Between ({selectedUserIds.length} / {members.length} Members)
        </label>
        <button
          type="button"
          onClick={selectAll}
          disabled={isAllSelected}
          className="text-xs text-primary underline-offset-4 hover:underline disabled:opacity-50 disabled:no-underline font-medium"
        >
          Select All 6 Roommates
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {members.map((member) => {
          const isSelected = selectedUserIds.includes(member.id);

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => toggleMember(member.id)}
              className={cn(
                "group relative flex items-center space-x-3 p-2.5 rounded-xl border text-left transition-all duration-200 select-none",
                isSelected
                  ? "border-primary bg-primary/5 text-foreground shadow-subtle"
                  : "border-border/60 bg-surface/30 text-muted-foreground hover:bg-surface hover:text-foreground"
              )}
            >
              <Avatar name={member.name} size="sm" />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold truncate block">
                  {member.name}
                </span>
                <span className="caption text-[10px] truncate block opacity-80">
                  {isSelected ? "Selected" : "Excluded"}
                </span>
              </div>

              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/80 bg-background"
                )}
              >
                {isSelected && <Icons.checkCircle className="h-3.5 w-3.5" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
