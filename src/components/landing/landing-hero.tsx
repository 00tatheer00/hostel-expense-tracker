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
import { InfoPopover } from "@/components/common/info-popover";

export function LandingHero() {
  const { login } = useAuth();

  const handleQuickLogin = (email: string) => {
    login(email, "password123");
  };

  return (
    <div className="w-full py-12 md:py-16 flex flex-col items-center justify-center text-center space-y-8 max-w-5xl mx-auto px-4">
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
          KamraKhata — <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-emerald-400 bg-clip-text text-transparent">
            Daily Kharcha Tracker
          </span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Khaass <strong className="text-foreground">Room 14, Al Syed Hostel</strong> ke liye banaya gaya aasan daily kharcha tracker.
          Doodh, roti, sabzi, gas cylinder aur grocery ka kharcha daalein, auto-equal split payein aur apna <em className="text-primary font-medium font-sans">Net Hisaab</em> ek click mein dekhein.
          <InfoPopover
            title="Room 14 App"
            explanation="Yeh app Room 14 ke roommates ke daily kharchay aur aapas ke hisaab-kitaab ko 100% transparent rakhne ke liye hai."
          />
        </p>
      </motion.div>

      {/* Call to Action Buttons */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md"
      >
        <Link href="/login" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-sm sm:text-base font-semibold shadow-card gap-2">
            <Icons.building className="h-5 w-5" />
            <span>Room 14 Mein Log In Karein</span>
          </Button>
        </Link>

        <Link href="/register" className="w-full sm:w-auto">
          <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 text-sm sm:text-base font-semibold gap-2 border-primary/40 hover:border-primary">
            <Icons.userPlus className="h-5 w-5 text-primary" />
            <span>New Roommate Register Karein</span>
          </Button>
        </Link>

        <Link href="/guide" className="w-full sm:w-auto">
          <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 h-12 text-xs sm:text-sm font-semibold gap-1.5">
            <Icons.help className="h-4 w-4 text-amber-500" />
            <span>App Use Karne Ka Tareeqa</span>
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
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center">
            <span>⚡ Room 14 Test Member Quick Login</span>
            <InfoPopover
              title="Quick Test Login"
              explanation="Test karne ke liye kisi bhi roommate ke naam par click karein. Aap bina password type kiye foran dashboard mein enter ho jayenge."
            />
          </span>
          <Badge variant="secondary" className="text-[10px]">
            Direct Entry
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

      {/* Features Grid with (i) tooltips */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-4 text-left"
      >
        <div className="p-5 rounded-2xl border border-border/60 bg-card/40 space-y-2 relative">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Icons.receipt className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-foreground">Rozana Ka Kharcha</h3>
            <InfoPopover
              title="Daily Kharcha Log"
              explanation="Doodh, roti, sabzi, gas cylinder ya kisi bhi grocery bill ka entry karein. Date aur pay karne wale roommate ka naam mention hota hai."
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Doodh, roti, sabzi, gas cylinder aur grocery bills seconds mein record karein.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border/60 bg-card/40 space-y-2 relative">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <Icons.users className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-foreground">Barabar Taqseem</h3>
            <InfoPopover
              title="Equal Split"
              explanation="Har kharcha Room 14 ke active roommates par auto-equal divide ho jata hai. Kisi ko alag se hisaab calculate nahi karna padta."
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Har daily kharcha automatically Room 14 ke roommates mein barabar split ho jata hai.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border/60 bg-card/40 space-y-2 relative">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Icons.wallet className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-foreground">Apna Personal Portal</h3>
            <InfoPopover
              title="Personal Roommate Portal"
              explanation="Aap ka apna dashboard jahan se aap live dekh sakte hain ke kitne paise aap ko roommates ko DENE HAIN ya un se LENE HAIN."
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Har roommate ka apna personal dashboard jahan net balance (LENE HAIN ya DENE HAIN) live dikhaye.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
