"use client";

import { useContext } from "react";
import { AuthContext } from "@/providers/auth-provider";
import { AuthContextType } from "@/types/auth";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
