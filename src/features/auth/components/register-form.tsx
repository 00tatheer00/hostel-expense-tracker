"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { scaleIn } from "@/lib/motion";
import { siteConfig } from "@/config/site";
import { InfoPopover } from "@/components/common/info-popover";

export function RegisterForm() {
  const { register: registerAuth, isLoading } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successNotice, setSuccessNotice] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessNotice(null);

    if (!name.trim()) {
      setServerError("Meharbani karke apna poora naam likhein");
      return;
    }
    if (!email.trim()) {
      setServerError("Meharbani karke sahi email ya username likhein");
      return;
    }

    const assignedPass = password.trim() ? password.trim() : `${name.trim().split(" ")[0]}123`;

    const res = await registerAuth(name, email, assignedPass);

    if (res.error) {
      setServerError(res.error);
    } else {
      setSuccessNotice(`Aap ka account register ho gaya hai! Password: "${assignedPass}" aap ki email par bhej diya gaya hai.`);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border border-border/80 bg-card shadow-card">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-subtle mb-2">
            <Icons.userPlus className="h-6 w-6" />
          </div>

          <CardTitle className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Roommate Registration
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            {siteConfig.roomNumber}, {siteConfig.hostelName} mein apna account banayein
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {successNotice ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs space-y-3">
                <div className="flex items-start space-x-2.5">
                  <Icons.checkCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-foreground">🎉 Registration Successful!</h4>
                    <p className="text-xs opacity-90">{successNotice}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-500/30 flex items-center justify-between">
                  <span className="text-[11px] opacity-80">Room 14 portal ab active hai.</span>
                  <a href="/" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                    <span>Enter Dashboard →</span>
                  </a>
                </div>
              </div>
            ) : serverError ? (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-start space-x-2">
                <Icons.alertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            ) : null}

            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-foreground flex items-center justify-between">
                <span>Aap Ka Poora Naam</span>
                <InfoPopover
                  title="Roommate Name"
                  explanation="Yeh naam room ke kharchon aur balance sheet par dikhayi dega."
                />
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="e.g. Masood, Hamza, Bilal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-foreground flex items-center justify-between">
                <span>Email Ya Username</span>
                <InfoPopover
                  title="Login Email & Credentials"
                  explanation="Is email par login credentials aur Weekly Khata Reports receive karenge."
                />
              </label>
              <input
                id="email"
                type="text"
                required
                placeholder="e.g. masood@gmail.com ya masood"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Password Field (Optional / Custom) */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-foreground flex items-center justify-between">
                <span>Password (Optional)</span>
                <InfoPopover
                  title="Password"
                  explanation="Khaali chorenge toh system automatic password generate karke email kar dega."
                />
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password select karein (Optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground p-0.5 rounded-md focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Icons.eyeOff className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Icons.eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* Room selection */}
            <div className="space-y-1.5">
              <label htmlFor="room" className="text-xs font-medium text-foreground">
                Hostel Aur Kamra Number
              </label>
              <input
                id="room"
                type="text"
                disabled
                value={`${siteConfig.roomNumber} - ${siteConfig.hostelName}`}
                className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-muted text-muted-foreground cursor-not-allowed font-medium"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-sm font-semibold shadow-subtle mt-2 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Account ban raha hai...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Register Karein & Direct Enter Karein</span>
                  <Icons.chevronRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 border-t border-border/40 py-3 bg-surface/30 text-center">
          <p className="text-xs text-muted-foreground">
            Pehle se registered hain?{" "}
            <a href="/login" className="text-primary font-semibold hover:underline">
              Yahan Log In Karein
            </a>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
