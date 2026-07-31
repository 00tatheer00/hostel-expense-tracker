import type { Metadata, Viewport } from "next";
import { Bitter, Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/providers";
import { AppLayout } from "@/components/layout/app-layout";
import { siteConfig } from "@/config/site";
import "./globals.css";

const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "KamraKhata",
    "Hostel Room Expense Tracker",
    "Roommate Split",
    "Room Expenses",
    "Splitwise Alternative",
  ],
  authors: [{ name: "KamraKhata Team" }],
  creator: "KamraKhata",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#161618" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bitter.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        <AppProviders>
          <AppLayout>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  );
}
