"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icons } from "@/lib/icons";

export function FloatingActionButton() {
  return (
    <motion.div
      className="fixed bottom-20 right-4 z-40 md:hidden"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.92 }}
    >
      <Link
        href="/expenses/new"
        className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 text-white flex items-center justify-center border border-white/30 active:scale-95 transition-all shadow-indigo-500/50 hover:shadow-indigo-500/70"
        title="Naya Kharcha Add Karein"
      >
        <Icons.plus className="h-7 w-7 stroke-[2.5]" />
        <span className="sr-only">Naya Kharcha Add Karein</span>
      </Link>
    </motion.div>
  );
}
