"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 p-4 rounded-2xl bg-white dark:bg-card border border-primary/20 shadow-glow"
      >
        <div className="flex items-center space-x-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold font-heading text-lg">
            K
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-foreground truncate">
              Install KamraKhata App
            </h4>
            <p className="caption text-[11px] text-muted-foreground truncate">
              Add to Home Screen for 1-tap offline access
            </p>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white gap-1 shadow-subtle py-1.5 px-3 h-8"
            >
              <Icons.plus className="h-3.5 w-3.5" />
              <span>Install</span>
            </Button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
              title="Dismiss"
            >
              <Icons.logout className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
