"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { HostelRule } from "../data/hostel-rules";
import { Icons } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RuleCardProps {
  rule: HostelRule;
  index: number;
}

export function RuleCard({ rule, index }: RuleCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    let text = `${rule.emoji} ${rule.number}. ${rule.title}\n\n`;
    text += rule.fullText.join("\n") + "\n";
    if (rule.bullets && rule.bullets.length > 0) {
      text += "\n" + rule.bullets.map((b) => `• ${b}`).join("\n") + "\n";
    }
    text += `\n💡 Key Point: "${rule.keyHighlight}"`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBorderColor = (category: string) => {
    switch (category) {
      case "ethics":
        return "border-indigo-500/30 hover:border-indigo-500/60";
      case "cleanliness":
        return "border-emerald-500/30 hover:border-emerald-500/60";
      case "routine":
        return "border-amber-500/30 hover:border-amber-500/60";
      case "finance":
        return "border-teal-500/30 hover:border-teal-500/60";
      case "privacy":
        return "border-purple-500/30 hover:border-purple-500/60";
      case "teamwork":
        return "border-blue-500/30 hover:border-blue-500/60";
      default:
        return "border-border/60 hover:border-border";
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case "ethics":
        return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30";
      case "cleanliness":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
      case "routine":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30";
      case "finance":
        return "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30";
      case "privacy":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30";
      case "teamwork":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30";
      default:
        return "bg-slate-100 dark:bg-surface text-foreground border-border";
    }
  };

  return (
    <motion.div
      id={`rule-${rule.number}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: (index % 6) * 0.05 }}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border bg-white/90 dark:bg-card/90 backdrop-blur-xl p-5 shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        getBorderColor(rule.category)
      )}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-surface text-xl shadow-xs border border-border/60 group-hover:scale-110 transition-transform">
              {rule.emoji}
            </span>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-xs font-black text-muted-foreground uppercase tracking-widest">
                  Rule #{rule.number}
                </span>
                <Badge variant="outline" className={cn("text-[10px] font-semibold py-0.5 px-2", getBadgeColor(rule.category))}>
                  {rule.categoryLabel}
                </Badge>
              </div>
              <h3 className="font-heading text-base sm:text-lg font-extrabold tracking-tight text-foreground mt-0.5">
                {rule.title}
              </h3>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            title="Copy Rule to share"
            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 rounded-lg hover:bg-slate-100 dark:hover:bg-surface"
          >
            {copied ? (
              <Icons.check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Icons.copy className="h-3.5 w-3.5" />
            )}
            <span className="sr-only">Copy</span>
          </Button>
        </div>

        {/* Rule Body / Description */}
        <div className="space-y-2.5 text-xs sm:text-sm text-foreground/90 leading-relaxed pt-1">
          {rule.fullText.map((paragraph, pIdx) => (
            <p key={pIdx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* Bullets if any */}
          {rule.bullets && rule.bullets.length > 0 && (
            <div className="my-3 rounded-xl bg-slate-50 dark:bg-surface/60 p-3 border border-border/50">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {rule.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="font-medium text-foreground/90">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Key Takeaway Callout Box */}
      <div className="mt-4 pt-3 border-t border-border/40">
        <div className="flex items-center space-x-2 rounded-xl bg-slate-100/70 dark:bg-surface/50 p-2.5 border border-border/40 text-xs font-semibold text-foreground">
          <Icons.sparkles className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="italic">{rule.keyHighlight}</span>
        </div>
      </div>
    </motion.div>
  );
}
