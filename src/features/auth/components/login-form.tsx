"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { loginSchema, LoginFormData } from "../schemas/login-schema";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { scaleIn } from "@/lib/motion";
import { siteConfig } from "@/config/site";
import { InfoPopover } from "@/components/common/info-popover";

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const res = await login(data.email, data.password);
    if (!res.success && res.error) {
      setServerError(res.error);
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
            <Icons.building className="h-6 w-6" />
          </div>

          <CardTitle className="font-heading text-2xl font-bold tracking-tight text-foreground">
            {siteConfig.name} Log In
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            {siteConfig.roomNumber}, {siteConfig.hostelName} Roommate Sign In
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-start space-x-2">
                <Icons.alertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-foreground flex items-center justify-between"
              >
                <span>Email Ya Roommate Naam</span>
                <InfoPopover
                  title="Email / Name Login"
                  explanation="Aap apna registered email ya apna naam (e.g. Masood, Hamza) likh kar log in kar sakte hain."
                />
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="text"
                  autoComplete="username"
                  placeholder="Apna naam ya email likhein"
                  className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-foreground flex items-center justify-between"
              >
                <span>Password</span>
                <InfoPopover
                  title="Password"
                  explanation="Account create karte waqt select kiya gaya password darj karein."
                />
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Apna password darj karein"
                  className="w-full h-10 pl-3 pr-10 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  {...register("password")}
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
              {errors.password && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-ring"
                {...register("rememberMe")}
              />
              <label
                htmlFor="rememberMe"
                className="text-xs text-muted-foreground cursor-pointer select-none"
              >
                Mujhe is browser par yaad rakhein
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-sm font-semibold shadow-subtle mt-2"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Log in ho raha hai...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Room 14 Mein Sign In Karein</span>
                  <Icons.chevronRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 border-t border-border/40 py-4 bg-surface/30 text-center">
          {/* Quick Demo Credentials Helper */}
          <div className="w-full space-y-1.5 pt-1">
            <span className="text-[10px] font-mono font-semibold uppercase text-muted-foreground block">
              ⚡ Quick Login Shortcuts
            </span>
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => login("admin", "TatheerIsAdmin.123")}
                className="text-[11px] font-mono border-indigo-500/40 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 gap-1 h-7"
              >
                <Icons.shieldAlert className="h-3 w-3" />
                <span>Admin Login (admin / TatheerIsAdmin.123)</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => login("masood@gmail.com", "masood123")}
                className="text-[11px] font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 gap-1 h-7"
              >
                <Icons.users className="h-3 w-3" />
                <span>Masood</span>
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-1">
            Room 14 ke naye roommate hain?{" "}
            <a href="/register" className="text-primary font-semibold hover:underline">
              Yahan Register Karein
            </a>
          </p>
          <p className="text-[10px] text-muted-foreground">
            Al Syed Hostel • Room 14 Private Expense Portal
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
