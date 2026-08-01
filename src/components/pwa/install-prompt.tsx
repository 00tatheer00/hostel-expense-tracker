"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isIOS, setIsIOS] = React.useState<boolean>(false);
  const [isStandalone, setIsStandalone] = React.useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [showIOSGuide, setShowIOSGuide] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Check if already running as standalone PWA
    const inStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://");

    if (inStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Check for iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Show prompt for mobile devices if not dismissed previously
    const dismissed = localStorage.getItem("kamrakhata_pwa_dismissed");
    if (!dismissed && (iosDevice || (window.innerWidth <= 768 && !inStandaloneMode))) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback instruction for browser menu add to home screen
      alert("Mobile Browser Menu (⋮ or  Share) par tap karein aur 'Add to Home Screen' / 'Install App' select karein.");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("kamrakhata_pwa_dismissed", "true");
  };

  if (isStandalone || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 p-4 rounded-2xl bg-slate-900 text-white border border-emerald-500/40 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center space-x-3.5">
          <img
            src="/icon-192.png"
            alt="KamraKhata Icon"
            className="h-10 w-10 shrink-0 rounded-xl border border-emerald-500/30 object-cover shadow-md"
          />

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>Install KamraKhata App</span>
              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">PWA</span>
            </h4>
            <p className="caption text-[11px] text-slate-300 truncate">
              1-Tap Add to Mobile Home Screen
            </p>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-1 shadow-lg py-1.5 px-3.5 h-8 border-0"
            >
              <Icons.plus className="h-3.5 w-3.5" />
              <span>Install</span>
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Dismiss"
            >
              <Icons.x className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* iOS Guided Banner Popup */}
        {showIOSGuide && (
          <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs text-slate-200 space-y-1">
            <p className="font-bold text-emerald-400">📱 iPhone / iPad Par Install Karein:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-300">
              <li>Safari menu mein **Share icon** ⎋ tap karein</li>
              <li>Neeche scroll karke **"Add to Home Screen" ➕** chunein</li>
            </ol>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
