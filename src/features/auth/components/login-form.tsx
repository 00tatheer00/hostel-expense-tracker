"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { loginSchema, LoginFormData } from "../schemas/login-schema";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";
import { scaleIn } from "@/lib/motion";
import { siteConfig } from "@/config/site";

const PRESET_ROOMMATES = [
  { name: "Waheed", email: "waheed@kamrakhata.internal", role: "Admin" },
  { name: "Usman", email: "usman@kamrakhata.internal", role: "Member" },
  { name: "Ali", email: "ali@kamrakhata.internal", role: "Member" },
  { name: "Aman", email: "aman@kamrakhata.internal", role: "Member" },
  { name: "Sadam", email: "sadam@kamrakhata.internal", role: "Member" },
  { name: "Masood", email: "masood@kamrakhata.internal", role: "Member" },
];

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "waheed@kamrakhata.internal",
      password: "password123",
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

  const fillPreset = (email: string) => {
    setValue("email", email);
    setValue("password", "password123");
    setServerError(null);
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
            {siteConfig.name}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            Sign in to {siteConfig.roomNumber}, {siteConfig.hostelName} Tracker
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Quick Roommate Login Selectors */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Room 14 Member Quick Login
              </span>
              <Badge variant="outline" className="text-[10px] font-mono py-0">
                Al Syed Hostel
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_ROOMMATES.map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => fillPreset(r.email)}
                  className="flex flex-col items-center justify-center p-2 rounded-lg border border-border/60 bg-surface/40 hover:bg-surface hover:border-primary/40 transition-all text-xs font-medium text-foreground text-center"
                >
                  <span className="font-semibold">{r.name}</span>
                  <span className="caption text-[10px] text-muted-foreground">{r.role}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-border/60"></div>
            <span className="flex-shrink mx-2 text-[10px] font-mono text-muted-foreground uppercase">
              or enter credentials
            </span>
            <div className="flex-grow border-t border-border/60"></div>
          </div>

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
                <span>Email or Roommate Name</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter email or roommate name"
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
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full h-10 pl-3 pr-10 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Icons.moon className="h-4 w-4" />
                  ) : (
                    <Icons.sun className="h-4 w-4" />
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
                Remember me on this browser
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
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign In to Room 14</span>
                  <Icons.chevronRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 border-t border-border/40 py-3 bg-surface/30 text-center">
          <p className="text-xs text-muted-foreground">
            New Roommate of Room 14?{" "}
            <a href="/register" className="text-primary font-semibold hover:underline">
              Register Here
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
