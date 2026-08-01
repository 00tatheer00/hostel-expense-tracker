"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";
import { fadeIn, scaleIn } from "@/lib/motion";
import { useAuth } from "@/hooks/use-auth";

export function LandingHero() {
  const { login } = useAuth();

  const handleQuickLogin = (email: string) => {
    login(email, "password123");
  };

  return (
    <div className="w-full py-12 md:py-20 flex flex-col items-center justify-center text-center space-y-10 max-w-5xl mx-auto px-4">
      {/* Top Hostel Badge */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm font-medium shadow-subtle"
      >
        <Icons.building className="h-4 w-4 shrink-0" />
        <span>{siteConfig.roomNumber} • {siteConfig.hostelName}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </motion.div>

      {/* Main Title */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        className="space-y-4 max-w-3xl"
      >
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading text-foreground leading-tight">
          Hostel Daily Kharcha & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-emerald-400 bg-clip-text text-transparent">
            Expense Tracker
          </span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Super simple daily expense tracker built specifically for <strong className="text-foreground">Room 14, Al Syed Hostel</strong>.
          Log daily kharcha (milk, roti, vegetables, grocery), divide expenses equally, and track your personal <em className="text-primary font-medium font-sans">Hisaab / Balances</em> effortlessly.
        </p>
      </motion.div>

      {/* Call to Action Buttons */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
      >
        <Link href="/login" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base font-semibold shadow-card gap-2">
            <Icons.building className="h-5 w-5" />
            <span>Login to Room 14</span>
          </Button>
        </Link>

        <Link href="/register" className="w-full sm:w-auto">
          <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 text-base font-semibold gap-2 border-primary/40 hover:border-primary">
            <Icons.userPlus className="h-5 w-5 text-primary" />
            <span>Register Roommate</span>
          </Button>
        </Link>
      </motion.div>

      {/* Quick Test Login Bar for Roommates */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-xl p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-card space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            ⚡ Quick Room 14 Member Demo Login
          </span>
          <Badge variant="secondary" className="text-[10px]">
            Instant Access
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { name: "Waheed", email: "waheed@kamrakhata.internal" },
            { name: "Usman", email: "usman@kamrakhata.internal" },
            { name: "Ali", email: "ali@kamrakhata.internal" },
            { name: "Aman", email: "aman@kamrakhata.internal" },
            { name: "Sadam", email: "sadam@kamrakhata.internal" },
            { name: "Masood", email: "masood@kamrakhata.internal" },
          ].map((m) => (
            <button
              key={m.name}
              onClick={() => handleQuickLogin(m.email)}
              className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-surface/50 hover:bg-primary/10 hover:border-primary/50 transition-all text-xs font-medium text-foreground group"
            >
              <span>{m.name}</span>
              <Icons.chevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-6 text-left"
      >
        <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Icons.receipt className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">Daily Kharcha Log</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Record daily room expenses like milk, roti, vegetables, gas cylinder & grocery in seconds.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <Icons.users className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">Equal Split</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every daily expense is automatically divided equally among active Room 14 members.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-2">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Icons.wallet className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">Personal Roommate Portal</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every roommate gets their dedicated portal to check exact net balance (kitne paise dene ya lene hain).
          </p>
        </div>
      </motion.div>
    </div>
  );
}
