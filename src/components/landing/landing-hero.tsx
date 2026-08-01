"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { fadeIn, scaleIn } from "@/lib/motion";
import { useAuth } from "@/hooks/use-auth";
import { InfoPopover } from "@/components/common/info-popover";

export function LandingHero() {
  const { login, register: registerAuth, isLoading } = useAuth();

  // Active form view: "login" | "register" | "guide"
  const [activeFormTab, setActiveFormTab] = React.useState<"login" | "register" | "guide">("login");

  // Form states
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  const [regName, setRegName] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [regPassword, setRegPassword] = React.useState("");
  const [serverError, setServerError] = React.useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!loginEmail.trim()) {
      setServerError("Meharbani karke apna naam ya email likhein");
      return;
    }

    const res = await login(loginEmail, loginPassword);
    if (!res.success && res.error) {
      setServerError(res.error);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!regName.trim()) {
      setServerError("Meharbani karke apna poora naam likhein");
      return;
    }
    if (!regEmail.trim()) {
      setServerError("Meharbani karke sahi email ya username likhein");
      return;
    }

    const res = await registerAuth(regName, regEmail, regPassword);
    if (!res.success && res.error) {
      setServerError(res.error);
    }
  };

  return (
    <div className="w-full py-10 md:py-14 flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto px-4">
      {/* Top Hostel Branding Badge */}
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
        className="space-y-3 max-w-2xl"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-foreground leading-tight">
          KamraKhata — <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-emerald-400 bg-clip-text text-transparent">
            Daily Kharcha Tracker
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Khaass <strong className="text-foreground">Room 14, Al Syed Hostel</strong> ke liye banaya gaya aasan daily kharcha tracker.
          Apna account banayein ya log in karein aur roommates ke aapas ka daily hisaab-kitaab live dekhein.
          <InfoPopover
            title="Room 14 App"
            explanation="Yeh app Room 14 ke roommates ke daily kharchay (doodh, roti, sabzi, grocery) ko 100% clear rakhne ke liye hai."
          />
        </p>
      </motion.div>

      {/* Form Tabs Switcher (Login / Register / Tareeqa) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-md space-y-4"
      >
        <div className="inline-flex rounded-xl bg-surface/80 p-1 border border-border/60 w-full justify-between">
          <button
            type="button"
            onClick={() => { setActiveFormTab("login"); setServerError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeFormTab === "login"
                ? "bg-primary text-primary-foreground shadow-subtle"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🔑 Log In
          </button>
          <button
            type="button"
            onClick={() => { setActiveFormTab("register"); setServerError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeFormTab === "register"
                ? "bg-primary text-primary-foreground shadow-subtle"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📝 Register
          </button>
          <button
            type="button"
            onClick={() => { setActiveFormTab("guide"); setServerError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeFormTab === "guide"
                ? "bg-amber-600 text-white shadow-subtle"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ℹ️ Tareeqa
          </button>
        </div>

        {/* Embedded Forms Container */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-card text-left space-y-4">
          {serverError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-start space-x-2">
              <Icons.alertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {activeFormTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center justify-between">
                  <span>Email Ya Roommate Naam</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masood ya masood@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Apna password darj karein"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 text-sm font-semibold shadow-subtle mt-2"
              >
                {isLoading ? "Log in ho raha hai..." : "Room 14 Mein Sign In Karein"}
              </Button>
            </form>
          )}

          {activeFormTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Aap Ka Poora Naam
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masood, Hamza, etc."
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Email Ya Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. masood@gmail.com ya masood"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Select password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 text-sm font-semibold shadow-subtle mt-2"
              >
                {isLoading ? "Account ban raha hai..." : "Register Karein & Join Karein"}
              </Button>
            </form>
          )}

          {activeFormTab === "guide" && (
            <div className="space-y-3 text-xs leading-relaxed text-foreground">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Icons.help className="h-4 w-4 text-amber-500" />
                <span>App Use Karne Ka Quick Tareeqa</span>
              </h4>
              <p>
                • <strong>Step 1:</strong> Apna account <strong>Register</strong> tab par banayein ya <strong>Log In</strong> tab se sign in karein.
              </p>
              <p>
                • <strong>Step 2:</strong> Dashboard par daily kharcha (milk, roti, gas, grocery) add karein.
              </p>
              <p>
                • <strong>Step 3:</strong> Net Hisaab dekhein: 🟢 Green balance ka matlab <strong>Paise LENE HAIN</strong>, 🔴 Red balance ka matlab <strong>Paise DENE HAIN</strong>.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
