"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import Image from "next/image";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isIOS, setIsIOS] = React.useState<boolean>(false);
  const [isStandalone, setIsStandalone] = React.useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = React.useState<boolean>(false);

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

    // Check for iOS (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
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
      setShowIOSModal(true);
    } else {
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("kamrakhata_pwa_dismissed", "true");
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Floating Bottom Bar Prompt */}
      {isVisible && (
        <AnimatePresence>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-50 p-3.5 sm:p-4 rounded-2xl bg-slate-900/95 text-white border border-emerald-500/40 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center space-x-3">
              <Image
                src="/icon-192.png"
                alt="KamraKhata Icon"
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-xl border border-emerald-500/30 object-cover shadow-md"
              />

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                  <span>Install KamraKhata</span>
                  <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full">
                    {isIOS ? "iOS Safari" : "PWA App"}
                  </span>
                </h4>
                <p className="caption text-[11px] text-slate-300 truncate">
                  {isIOS ? "iPhone Home Screen par add karein" : "Fast & Offline App Install"}
                </p>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                <Button
                  size="sm"
                  onClick={handleInstallClick}
                  className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-1 shadow-lg py-1.5 px-3 h-8 border-0"
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
          </motion.div>
        </AnimatePresence>
      )}

      {/* iOS Step-by-Step Installation Modal Sheet */}
      <AnimatePresence>
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full sm:max-w-md bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl p-6 text-white shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/icon-192.png"
                    alt="KamraKhata"
                    width={36}
                    height={36}
                    className="rounded-xl border border-emerald-500/40"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-white">📱 iPhone Par Install Kaise Karein?</h3>
                    <p className="text-xs text-slate-400">KamraKhata ko Safari ke zariye Home Screen par add karein</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <Icons.x className="h-4 w-4" />
                </button>
              </div>

              {/* Notice if not in Safari */}
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <Icons.info className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  <strong>Zaroori Note:</strong> Apple iOS policy ke mutabiq yeh srf <strong>Safari Browser</strong> mein install ho sakta hai. Agar aap Chrome ya WhatsApp in-app browser mein hain to link ko Safari mein open karein.
                </span>
              </div>

              {/* 3 Step Visual Guide */}
              <div className="space-y-3 text-xs">
                {/* Step 1 */}
                <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-xs">
                    1
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <span>Safari ke Neeche <strong>Share Button</strong> dabayein</span>
                      <span className="p-1 rounded bg-slate-700 text-white inline-flex text-xs">⎋ / 📤</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      iPhone Safari ke bottom bar mein &quot;Share&quot; (Square with Up Arrow) icon par click karein.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-xs">
                    2
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <span>Neeche scroll karein aur <strong>&quot;Add to Home Screen&quot;</strong> chunein</span>
                      <span className="p-1 rounded bg-slate-700 text-white inline-flex text-xs">➕</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Menu mein thora neeche scroll karke &quot;Add to Home Screen&quot; option par tap karein.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-xs">
                    3
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-100">
                      Top-Right par <strong>&quot;Add&quot;</strong> dabayein
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      KamraKhata aap ke iPhone ki Home Screen par real iOS app ki tarah save ho jayega! 🎉
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setShowIOSModal(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 text-xs"
              >
                Samajh Aa Gaya! 👍
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
