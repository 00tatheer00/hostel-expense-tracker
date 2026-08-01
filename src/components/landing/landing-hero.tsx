"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/lib/icons";
import { siteConfig } from "@/config/site";
import { fadeIn, scaleIn } from "@/lib/motion";

export function LandingHero() {
  const { login, register: registerAuth, isLoading } = useAuth();
  const [activeFormTab, setActiveFormTab] = React.useState<"login" | "register" | "guide">("login");
  const [showPassword, setShowPassword] = React.useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  // Register form state
  const [regName, setRegName] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [registeredData, setRegisteredData] = React.useState<{ name: string; email: string; pass: string } | null>(null);

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
    setRegisteredData(null);

    if (!regName.trim()) {
      setServerError("Meharbani karke apna poora naam likhein");
      return;
    }
    if (!regEmail.trim()) {
      setServerError("Meharbani karke sahi email ya username likhein");
      return;
    }

    const autoPassword = `${regName.trim().split(" ")[0]}123`;
    const res = await registerAuth(regName, regEmail, autoPassword);

    if (!res.success && res.error) {
      setServerError(res.error);
    } else {
      setRegisteredData({
        name: regName.trim(),
        email: regEmail.trim(),
        pass: autoPassword,
      });
    }
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center px-4 py-4 md:py-8 max-w-xl md:max-w-4xl mx-auto overflow-hidden">
      <div className="w-full space-y-4 md:space-y-6 flex flex-col items-center">
        {/* Top Room Badge */}
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
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ℹ️ Tareeqa
            </button>
          </div>

          {/* Form Card */}
          <Card className="border border-border/80 bg-card shadow-card">
            <CardContent className="pt-4 pb-4 px-4 sm:px-6">
              {serverError && (
                <div className="mb-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center space-x-2">
                  <Icons.alertCircle className="h-4 w-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Login Form */}
              {activeFormTab === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Email Ya Roommate Naam
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Masood, admin, ya masood@gmail.com"
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Password (If set)"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full h-9 pl-3 pr-9 py-1.5 text-xs sm:text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground p-0.5 rounded focus:outline-none"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
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

              {/* Register Form */}
              {activeFormTab === "register" && (
                registeredData ? (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs space-y-2.5">
                    <div className="flex items-start space-x-2">
                      <Icons.checkCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-foreground">🎉 Account Created & Email Sent!</h4>
                        <p className="text-[11px] opacity-90">
                          📧 <strong>Apni Email Inbox Check Karein!</strong> Login credentials <strong>{registeredData.email}</strong> par mail kar diye gaye hain.
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-background/90 border border-emerald-500/30 text-foreground space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-sans">Name:</span>
                        <strong>{registeredData.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-sans">Email/ID:</span>
                        <strong>{registeredData.email}</strong>
                      </div>
                      <div className="flex justify-between border-t border-border/40 pt-1">
                        <span className="text-muted-foreground font-sans">Password:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{registeredData.pass}</strong>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => setActiveFormTab("login")} 
                      className="w-full h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Log In Screen Par Jayein →</span>
                    </button>
                  </div>
                ) : (
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

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-10 text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md mt-2"
                    >
                      {isLoading ? "Register ho raha hai..." : "Register Karein & Join Karein"}
                    </Button>
                  </form>
                )
              )}

              {/* Guide Info Tab */}
              {activeFormTab === "guide" && (
                <div className="space-y-2 text-xs text-muted-foreground py-1">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                    <span>💡 Room 14 Khata Ka Tarika</span>
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed">
                    <li>Apna **Poora Naam** aur **Email** se register karein.</li>
                    <li>Kharcha add karein aur roommates ke sath auto-split karein.</li>
                    <li>Monthly budget tracker aur personal debt analytics automatically calculate hote hain.</li>
                  </ul>
                  <Button
                    type="button"
                    onClick={() => setActiveFormTab("register")}
                    className="w-full h-8 text-xs font-semibold bg-primary text-primary-foreground mt-2"
                  >
                    Naya Account Banayein →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
