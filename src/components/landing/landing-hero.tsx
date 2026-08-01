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
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);

  const [regName, setRegName] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [regPassword, setRegPassword] = React.useState("");
  const [showRegPassword, setShowRegPassword] = React.useState(false);

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
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center px-4 py-4 md:py-8 max-w-xl md:max-w-4xl mx-auto overflow-hidden">
      <div className="w-full flex flex-col items-center justify-center space-y-4 my-auto">
        {/* Top Hostel Branding Badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-xs font-semibold shadow-sm"
        >
          <Icons.building className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
          <span>{siteConfig.roomNumber} • {siteConfig.hostelName}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          className="space-y-1.5 text-center max-w-lg"
        >
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading text-foreground leading-tight">
            KamraKhata —{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
              Daily Kharcha Tracker
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
            <strong className="text-foreground font-semibold">{siteConfig.roomNumber}</strong> ke roommates ka daily milk, roti & grocery hisaab-kitaab.
          </p>
        </motion.div>

        {/* Form Tabs Switcher (Login / Register / Tareeqa) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full max-w-md space-y-3"
        >
          <div className="inline-flex rounded-xl bg-surface/90 p-1 border border-border/80 w-full justify-between shadow-sm">
            <button
              type="button"
              onClick={() => { setActiveFormTab("login"); setServerError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeFormTab === "login"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🔑 Log In
            </button>
            <button
              type="button"
              onClick={() => { setActiveFormTab("register"); setServerError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeFormTab === "register"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              📝 Register
            </button>
            <button
              type="button"
              onClick={() => { setActiveFormTab("guide"); setServerError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeFormTab === "guide"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ℹ️ Tareeqa
            </button>
          </div>

          {/* Embedded Forms Container */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-md text-left space-y-3">
            {serverError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start space-x-2">
                <Icons.alertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {activeFormTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Email Ya Roommate Naam</span>
                    <InfoPopover
                      title="Login ID"
                      explanation="Apna registered email ya naam (e.g. Masood, Hamza) darj karein."
                    />
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masood ya masood@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full h-9 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      placeholder="Apna password darj karein"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full h-9 pl-3 pr-9 py-1.5 text-xs sm:text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground p-0.5 rounded focus:outline-none"
                      aria-label="Toggle password visibility"
                    >
                      {showLoginPassword ? (
                        <Icons.eyeOff className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Icons.eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md mt-1"
                >
                  {isLoading ? "Log in ho raha hai..." : "Room 14 Mein Sign In Karein"}
                </Button>
              </form>
            )}

            {activeFormTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Aap Ka Poora Naam
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masood, Hamza, etc."
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full h-9 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Email Ya Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. masood@gmail.com ya masood"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full h-9 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      required
                      placeholder="Select password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full h-9 pl-3 pr-9 py-1.5 text-xs sm:text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground p-0.5 rounded focus:outline-none"
                      aria-label="Toggle password visibility"
                    >
                      {showRegPassword ? (
                        <Icons.eyeOff className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Icons.eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md mt-1"
                >
                  {isLoading ? "Account ban raha hai..." : "Register Karein & Join Karein"}
                </Button>
              </form>
            )}

            {activeFormTab === "guide" && (
              <div className="space-y-2 text-xs leading-relaxed text-foreground">
                <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <Icons.help className="h-4 w-4 text-emerald-500" />
                  <span>App Use Karne Ka Quick Tareeqa</span>
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  • <strong>Step 1:</strong> Apna account <strong>Register</strong> tab par banayein ya <strong>Log In</strong> tab se sign in karein.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  • <strong>Step 2:</strong> Dashboard par daily kharcha (doodh, roti, gas, grocery) add karein.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  • <strong>Step 3:</strong> Net Hisaab dekhein: 🟢 Green = <strong>Paise LENE HAIN</strong>, 🔴 Red = <strong>Paise DENE HAIN</strong>.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
