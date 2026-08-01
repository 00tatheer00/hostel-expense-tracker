"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ContentWrapper } from "@/components/layout/content-wrapper";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { siteConfig } from "@/config/site";
import { fadeIn, scaleIn } from "@/lib/motion";

export default function GuidePage() {
  const [activeTab, setActiveTab] = React.useState<"steps" | "terms">("steps");

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              App Use Karne Ka Mukammal Tareeqa
            </h1>
            <Badge variant="success" className="font-mono text-xs gap-1">
              <Icons.sparkles className="h-3 w-3 text-amber-400" />
              <span>Start to End Guide</span>
            </Badge>
          </div>
          <p className="caption text-xs sm:text-sm text-muted-foreground mt-1">
            {siteConfig.roomNumber}, {siteConfig.hostelName} ke tamam roomies ke liye step-by-step guideline.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="/">
            <Button size="sm" className="gap-2 font-semibold">
              <Icons.home className="h-4 w-4" />
              <span>Go to Khata Home</span>
            </Button>
          </Link>
        </div>
      </div>

      <ContentWrapper>
        {/* Toggle Mode */}
        <div className="flex justify-center border-b border-border/40 pb-2">
          <div className="inline-flex rounded-xl bg-surface/60 p-1 border border-border/60">
            <button
              onClick={() => setActiveTab("steps")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "steps"
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              📋 Step-by-Step Step Manual (Start to End)
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "terms"
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ℹ️ Detail Terms Glossary (Har Cheez Ka Matlab)
            </button>
          </div>
        </div>

        {activeTab === "steps" ? (
          /* STEP BY STEP MANUAL */
          <div className="space-y-6 pt-2">
            {/* Step 1 */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="border border-emerald-500/30 bg-card shadow-card">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-emerald-600 text-white font-mono font-bold">
                        STEP 1
                      </Badge>
                      <CardTitle className="text-lg font-bold text-foreground">
                        Account Banayein Ya Log In Karein (Sign In / Register)
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Pehli dafa aane par apna roommate account register karein ya preset login button dabayein.
                    </CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Icons.userPlus className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/90 border-t border-border/40 pt-3">
                  <p>
                    • Agar aap pehli dafa aye hain toh <strong>&quot;Register Roommate&quot;</strong> wale option par jayein aur apna Name, Email aur Password darj karein.
                  </p>
                  <p>
                    • Test karne ke liye Landing Page par <strong>Waheed, Usman, Ali, Aman, Sadam, Masood</strong> ke 1-Click quick login buttons diye gaye hain.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 2 */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="border border-indigo-500/30 bg-card shadow-card">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-indigo-600 text-white font-mono font-bold">
                        STEP 2
                      </Badge>
                      <CardTitle className="text-lg font-bold text-foreground">
                        Rozana Ka Kharcha Add Karein (Daily Expense Entry)
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Doodh, Roti, Sabzi, Gas Cylinder, Pani ya Grocery ka kharcha app mein darj karein.
                    </CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                    <Icons.plus className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/90 border-t border-border/40 pt-3">
                  <p>
                    1. Main Dashboard par <strong>&quot;Naya Kharcha Jodein&quot;</strong> button click karein.
                  </p>
                  <p>
                    2. Kharchay ki tafseel (maslan <em>Milk - 1 Liter</em>), total raqam (<em>Rs. 220</em>), aur pay karne wale roommate ka naam select karein.
                  </p>
                  <p>
                    3. App auto-equal split karke Room 14 ke tamam 6 roommates mein kharcha barabar taqseem kar dega.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 3 */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="border border-amber-500/30 bg-card shadow-card">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-amber-600 text-white font-mono font-bold">
                        STEP 3
                      </Badge>
                      <CardTitle className="text-lg font-bold text-foreground">
                        Apna Net Hisaab-Kitaab Dekhein (Live Balances Check)
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Kisko kitne paise dene hain ya kis se lene hain, live dashboard par hamesha update hota rehta hai.
                    </CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Icons.wallet className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/90 border-t border-border/40 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      <strong className="block font-bold">🟢 Green Balance (LENE HAIN)</strong>
                      <span>Aap ne room ke liye ziada kharcha kiya hai. Baqi roommates se paise lene baqi hain.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                      <strong className="block font-bold">🔴 Red Balance (DENE HAIN)</strong>
                      <span>Aap ka share baqi hai. Aap ko roommates ko paise waapas dene hain.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 4 */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="border border-purple-500/30 bg-card shadow-card">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-600 text-white font-mono font-bold">
                        STEP 4
                      </Badge>
                      <CardTitle className="text-lg font-bold text-foreground">
                        Khaata Safaya Karein (Settle Up / Direct Payment)
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Mahinay ke aakhir mein kam se kam transaction ke zariye hisaab clear karein.
                    </CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                    <Icons.checkCircle className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed text-foreground/90 border-t border-border/40 pt-3">
                  <p>
                    • Main top nav par <strong>&quot;Settle Up&quot;</strong> button click karke direct roommate ko cash, JazzCash ya Easypaisa bhejein.
                  </p>
                  <p>
                    • Transaction enter hote hi dono roommates ka khata auto balance zero ho jayega.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          /* GLOSSARY OF TERMS */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              {
                term: "Net Balance (Net Hisaab)",
                icon: "wallet",
                definition:
                  "Net balance ka matlab hai: Total Paid (Aap ne jitne paise diye) minus Total Owed (Aap ka jitna share banta hai). Agar answer positive ho toh paise LENE HAIN, agar negative ho toh DENE HAIN.",
              },
              {
                term: "Equal Split (Barabar Taqseem)",
                icon: "users",
                definition:
                  "Koi bhi kharcha (maslan Rs. 600 ki sabzi) jab add hota hai toh room ke sabhi 6 roommates (Rs. 100 per person) par barabar split ho jata hai.",
              },
              {
                term: "Creditor (Lene Wala)",
                icon: "arrowUpRight",
                definition:
                  "Woh roommate jis ne room ke kharchay akele pay kiye hain aur ab uska balance positive hai. Usay doosron se paise milne hain.",
              },
              {
                term: "Debtor (Dene Wala)",
                icon: "arrowDownLeft",
                definition:
                  "Woh roommate jis ne rozana kharchon mein kam amount pay ki hai aur uska net balance minus mein hai. Usay paise dene hain.",
              },
              {
                term: "Settle Up (Khaata Safaya)",
                icon: "checkCircle",
                definition:
                  "Jab do roommates aas-paas mein cash ya mobile wallet ke zariye paise adaa kar dete hain toh app mein 'Settle Up' entry ki jaati hai taakay unka hisaab clear ho sake.",
              },
              {
                term: "Roommate Portal",
                icon: "building",
                definition:
                  "Har roommate ka apna private dashboard jahan se woh apna personal hisaab, rozana ka kharcha, aur room ki summary ek jaga dekh sakta hai.",
              },
            ].map((item) => (
              <Card key={item.term} className="border border-border/70 bg-card p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Icons.info className="h-4 w-4" />
                  </span>
                  <h4 className="font-heading font-bold text-sm text-foreground">
                    ℹ️ {item.term}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.definition}
                </p>
              </Card>
            ))}
          </div>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
}
