"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HOSTEL_RULES, HOSTEL_CATEGORIES, HostelRule } from "../data/hostel-rules";
import { RuleCard } from "./rule-card";
import { Icons } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function RulesView() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "compact">("grid");
  const [hasPledged, setHasPledged] = React.useState(false);
  const [copiedAll, setCopiedAll] = React.useState(false);
  const [showQuickJump, setShowQuickJump] = React.useState(false);

  React.useEffect(() => {
    try {
      const ack = localStorage.getItem("hostel_rules_acknowledged_v1");
      if (ack === "true") {
        setHasPledged(true);
      }
    } catch {}
  }, []);

  const handlePledge = () => {
    setHasPledged(true);
    try {
      localStorage.setItem("hostel_rules_acknowledged_v1", "true");
      localStorage.setItem(
        "hostel_rules_acknowledged_at",
        new Date().toISOString()
      );
      if (user) {
        localStorage.setItem("hostel_rules_acknowledged_user", user.name);
      }
    } catch {}
  };

  const handleCopyAllForWhatsApp = () => {
    let fullDoc = `🏠 *HOSTEL RULES & GUIDELINES*\n`;
    fullDoc += `📍 ${siteConfig.roomNumber} • ${siteConfig.hostelName}\n\n`;
    fullDoc += `Guys, please read all the points carefully.\n`;
    fullDoc += `Ye rules kisi ek person ke liye nahi hain. *Ye sab ke liye equally hain.*\n`;
    fullDoc += `Hum sab ek saath reh rahe hain, isliye hostel ko peacefully aur comfortably chalane ke liye *discipline, respect, cleanliness, responsibility aur teamwork* zaroori hain.\n\n`;
    fullDoc += `==============================\n\n`;

    HOSTEL_RULES.forEach((r) => {
      fullDoc += `${r.emoji} *${r.number}. ${r.title}*\n`;
      r.fullText.forEach((p) => {
        fullDoc += `${p}\n`;
      });
      if (r.bullets) {
        r.bullets.forEach((b) => {
          fullDoc += `• ${b}\n`;
        });
      }
      fullDoc += `👉 *Key:* "${r.keyHighlight}"\n\n`;
    });

    fullDoc += `==============================\n`;
    fullDoc += `🏡 *FINAL REQUEST*\n`;
    fullDoc += `Again, ye rules kisi ek person ke liye nahi hain. *Ye sab ke liye hain aur sab ko equally follow karne hain.*\n`;
    fullDoc += `Maqsad: Respect karein • Help karein • Responsible banein • Money save karein • Cleanliness maintain karein • Peacefully saath rahen.\n\n`;
    fullDoc += `❤️ *I hope everyone will understand these points and maintain a good environment. Thank you everyone!*`;

    navigator.clipboard.writeText(fullDoc);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Filtered Rules logic
  const filteredRules = React.useMemo(() => {
    return HOSTEL_RULES.filter((rule) => {
      const matchesCategory =
        selectedCategory === "all" || rule.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      return (
        rule.title.toLowerCase().includes(query) ||
        rule.summary.toLowerCase().includes(query) ||
        rule.keyHighlight.toLowerCase().includes(query) ||
        rule.fullText.some((t) => t.toLowerCase().includes(query)) ||
        (rule.bullets && rule.bullets.some((b) => b.toLowerCase().includes(query)))
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl">
        {/* Glowing Orbs in Background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/30 blur-[90px]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-rose-500/25 blur-[90px]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px]" />

        <div className="relative z-10 space-y-5 max-w-4xl">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="bg-indigo-500/20 text-indigo-200 border-indigo-400/40 text-xs font-mono font-bold px-3 py-1 gap-1.5 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
              </span>
              <span>{siteConfig.roomNumber} • {siteConfig.hostelName}</span>
            </Badge>

            <Badge
              variant="outline"
              className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40 text-xs font-mono font-bold px-3 py-1 gap-1"
            >
              <Icons.shieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Equal For All Roommates</span>
            </Badge>

            <Badge
              variant="outline"
              className="bg-amber-500/20 text-amber-300 border-amber-400/40 text-xs font-mono font-bold px-3 py-1 gap-1"
            >
              <Icons.sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>19 Core Guidelines</span>
            </Badge>
          </div>

          {/* Main Title */}
          <div>
            <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-white flex items-center gap-3">
              <span>🏠 HOSTEL RULES &amp; GUIDELINES</span>
            </h1>
            <p className="caption text-sm sm:text-base text-indigo-100/90 font-medium mt-2">
              Discipline • Respect • Cleanliness • Responsibility • Teamwork
            </p>
          </div>

          {/* Intro Box in Urdu / Roman Urdu */}
          <div className="rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/15 p-4 sm:p-5 space-y-2 text-xs sm:text-sm leading-relaxed text-indigo-50">
            <p className="font-bold text-amber-300 text-sm sm:text-base">
              📢 Guys, please read all the points carefully.
            </p>
            <p>
              Ye rules kisi ek person ke liye nahi hain. <strong className="text-white underline decoration-amber-400 font-extrabold">Ye sab ke liye equally hain.</strong>
            </p>
            <p>
              Hum sab ek saath reh rahe hain, isliye hostel ko peacefully aur comfortably chalane ke liye <strong className="text-white">discipline, respect, cleanliness, responsibility aur teamwork</strong> zaroori hain.
            </p>
            <p className="text-indigo-200">
              In points ko sirf rules na samjhein. Ye hostel mein achi aur respectful life guzarnay ke basic <strong className="text-white">adab aur responsibilities</strong> hain.
            </p>
          </div>

          {/* Quick Actions Header */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={handleCopyAllForWhatsApp}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold gap-2 backdrop-blur-md"
            >
              {copiedAll ? (
                <>
                  <Icons.check className="h-4 w-4 text-emerald-400" />
                  <span>Rules Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Icons.share className="h-4 w-4 text-emerald-400" />
                  <span>Copy Full Rules (WhatsApp Format)</span>
                </>
              )}
            </Button>

            <Link href="/">
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 text-xs font-semibold gap-1.5"
              >
                <Icons.home className="h-4 w-4" />
                <span>Khata Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Pillars Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: "🤝", title: "Respect", desc: "Akhlaq & Adab" },
          { icon: "🧹", title: "Cleanliness", desc: "Sab ki zimmedari" },
          { icon: "⏰", title: "8:00 AM", desc: "Morning routine" },
          { icon: "💵", title: "Rs. 5,000", desc: "Monthly pool" },
          { icon: "🏍️", title: "Hostel Bike", desc: "Responsible use" },
          { icon: "🔐", title: "Privacy", desc: "Belongings respect" },
        ].map((pillar, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center text-center p-3 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-white/70 dark:bg-card/70 backdrop-blur-md shadow-xs hover:scale-105 transition-transform"
          >
            <span className="text-2xl mb-1">{pillar.icon}</span>
            <span className="font-heading text-xs font-bold text-foreground">
              {pillar.title}
            </span>
            <span className="caption text-[10px] text-muted-foreground font-medium">
              {pillar.desc}
            </span>
          </div>
        ))}
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="sticky top-16 z-30 space-y-3 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Icons.search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rule (e.g., bike, 5000, washroom, 8:00 AM, food)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-border bg-slate-50/80 dark:bg-surface/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icons.x className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Jump Dropdown Toggle & View Mode */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuickJump(!showQuickJump)}
                className="text-xs font-bold gap-1.5 border-slate-200 dark:border-border"
              >
                <Icons.rules className="h-3.5 w-3.5 text-indigo-500" />
                <span>Jump to Rule</span>
                <Icons.chevronRight
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    showQuickJump && "rotate-90"
                  )}
                />
              </Button>

              {/* Jump Menu Overlay */}
              {showQuickJump && (
                <div className="absolute right-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase text-muted-foreground border-b border-border/50">
                    Select Rule to View
                  </div>
                  {HOSTEL_RULES.map((r) => (
                    <a
                      key={r.number}
                      href={`#rule-${r.number}`}
                      onClick={() => setShowQuickJump(false)}
                      className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-100 dark:hover:bg-surface transition-colors"
                    >
                      <span>{r.emoji}</span>
                      <span className="font-mono text-[10px] text-muted-foreground font-bold">
                        #{r.number}
                      </span>
                      <span className="truncate text-foreground font-semibold">
                        {r.title}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-surface p-1 border border-border/50">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid Cards View"
                className={cn(
                  "p-1.5 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "grid"
                    ? "bg-white dark:bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icons.dashboard className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("compact")}
                title="Compact List View"
                className={cn(
                  "p-1.5 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "compact"
                    ? "bg-white dark:bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icons.checkSquare className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {HOSTEL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs scale-105"
                    : "bg-white/70 dark:bg-card/70 text-muted-foreground hover:text-foreground border-slate-200/80 dark:border-border/60 hover:bg-slate-100"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Filter Results Info */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
          Showing {filteredRules.length} of {HOSTEL_RULES.length} Rules
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* 5. Rules Rendering */}
      {filteredRules.length === 0 ? (
        <div className="text-center py-12 rounded-3xl border border-dashed border-border p-8 bg-card/40">
          <span className="text-4xl mb-2 block">🔍</span>
          <h3 className="font-heading text-base font-bold text-foreground">
            No rules match &quot;{searchQuery}&quot;
          </h3>
          <p className="caption text-xs text-muted-foreground mt-1">
            Try searching for &quot;cleanliness&quot;, &quot;bike&quot;, &quot;5000&quot; or &quot;morning&quot;.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 text-xs font-bold"
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRules.map((rule, idx) => (
            <RuleCard key={rule.number} rule={rule} index={idx} />
          ))}
        </div>
      ) : (
        /* Compact Checklist View */
        <div className="space-y-3">
          {filteredRules.map((rule) => (
            <div
              key={rule.number}
              id={`rule-${rule.number}`}
              className="flex items-start justify-between gap-3 p-4 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-white/90 dark:bg-card/90 backdrop-blur-md shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl shrink-0 mt-0.5">{rule.emoji}</span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-muted-foreground">
                      #{rule.number}
                    </span>
                    <h4 className="font-heading text-sm font-extrabold text-foreground">
                      {rule.title}
                    </h4>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      {rule.categoryLabel}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground/85 leading-relaxed">
                    {rule.summary}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    💡 &quot;{rule.keyHighlight}&quot;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Grand Final Request & Pledge Card */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900/60 p-6 sm:p-10 shadow-lg">
        <div className="space-y-6 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white text-3xl shadow-lg shadow-indigo-500/30 mx-auto">
            🏡
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              FINAL REQUEST &amp; ROOMMATE PLEDGE
            </h2>
            <p className="caption text-xs sm:text-sm text-muted-foreground font-medium">
              Ye rules kisi ek bande ke liye nahi hain. Ye hum sab ke sukoon, izzat aur behtareen hostel life ke liye hain.
            </p>
          </div>

          {/* 6 Core Action Pillars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            {[
              { text: "🤝 Respect karein", desc: "Ek doosre ki izzat" },
              { text: "🤲 Help karein", desc: "Ek doosre ka haath batayein" },
              { text: "🛡️ Responsible banein", desc: "Apni zimmedari khud lein" },
              { text: "💰 Money save karein", desc: "Budget control rakhein" },
              { text: "🧹 Cleanliness maintain", desc: "Hostel ko saaf rakhein" },
              { text: "🕊️ Peacefully saath rahen", desc: "Bhai-bhai ban kar chalein" },
            ].map((p, pIdx) => (
              <div
                key={pIdx}
                className="p-3 rounded-xl border border-border/60 bg-white/80 dark:bg-card/80 backdrop-blur-md"
              >
                <div className="font-heading text-xs font-bold text-foreground">
                  {p.text}
                </div>
                <div className="caption text-[10px] text-muted-foreground">
                  {p.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
            Agar hum sab apni responsibility properly fulfill karein, to hostel life bohat easy, peaceful aur enjoyable ho sakti hai.
            <br />
            <strong className="text-foreground font-bold">
              &quot;I hope everyone will understand these points, cooperate with each other, and maintain a good environment in the hostel. ❤️&quot;
            </strong>
          </div>

          {/* Interactive Acknowledgment Pledge Button */}
          <div className="pt-2">
            {hasPledged ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-heading text-sm font-bold shadow-lg shadow-emerald-500/30"
              >
                <Icons.checkCircle className="h-5 w-5" />
                <span>You Have Acknowledged &amp; Agreed to the Hostel Rules! 👍</span>
              </motion.div>
            ) : (
              <Button
                onClick={handlePledge}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-extrabold text-sm sm:text-base px-8 py-6 rounded-2xl shadow-xl shadow-indigo-500/30 gap-2 transition-all hover:scale-105"
              >
                <Icons.handshake className="h-5 w-5" />
                <span>🤝 I Have Read &amp; Agree to Follow the Hostel Rules</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
