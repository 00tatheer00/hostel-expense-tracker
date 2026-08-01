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
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [registeredData, setRegisteredData] = React.useState<{ name: string; email: string; pass: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setRegisteredData(null);

    if (!name.trim()) {
      setServerError("Meharbani karke apna poora naam likhein");
      return;
    }
    if (!email.trim()) {
      setServerError("Meharbani karke sahi email ya username likhein");
      return;
    }

    const autoPassword = `${name.trim().split(" ")[0]}123`;

    const res = await registerAuth(name, email, autoPassword);

    if (res.error) {
      setServerError(res.error);
    } else {
      setRegisteredData({
        name: name.trim(),
        email: email.trim(),
        pass: autoPassword,
      });
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
          {registeredData ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-emerald-500/20 border-2 border-emerald-500 text-foreground space-y-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-bold shrink-0 shadow-md">
                  <Icons.checkCircle className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-emerald-900 dark:text-emerald-300">
                    🎉 Registration Successful!
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Room 14 account created & active in Supabase.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-emerald-500/40 space-y-2 font-mono text-xs shadow-inner">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                  <span>📧 EMAIL DISPATCHED TO YOUR INBOX:</span>
                </div>
                <p className="text-xs text-foreground font-sans leading-relaxed">
                  Aap ke login credentials email inbox <strong>{registeredData.email}</strong> par send kar diye gaye hain. Email inbox check karein.
                </p>

                <div className="border-t border-border/60 pt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Roommate Name:</span>
                    <strong className="font-bold">{registeredData.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-sans">Email / Username:</span>
                    <strong className="font-bold text-indigo-600 dark:text-indigo-400">{registeredData.email}</strong>
                  </div>
                  <div className="flex justify-between border-t border-border/40 pt-1">
                    <span className="text-muted-foreground font-sans">Password:</span>
                    <strong className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{registeredData.pass}</strong>
                  </div>
                </div>
              </div>

              <a
                href="/"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
              >
                <span>🚀 Enter Room 14 Dashboard Now →</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {serverError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-start space-x-2">
                  <Icons.alertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

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
          )}
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
