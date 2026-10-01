# KamraKhata - Hostel Room Expense Tracker

> A modern, mobile-first SaaS web application built for Room 14, Al Syed Hostel with eight roommates (**Tatheer, Sadam, Ahmed Ali, Syed Ali Mehdi, Muhammad Rohail, Amanullah, Aizaz, Masood**).

---

## 🌟 Key Features

- **Dynamic Real-time Balance Engine**: Room net balances are computed dynamically in real time without persist storage.
- **Smart Settlement Engine**: Greedy minimum cash flow debt optimization algorithm generating the exact minimum transactions required to settle room debts.
- **Roommate Split Selector**: Split purchases equally or custom multi-select across all roommates.
- **Expense CRUD Management**: Full history, instant debounced search, category filters, and date-grouped timeline breakdown (`Today`, `Yesterday`, `This Week`, `This Month`, `Older`).
- **Analytics & Insights**: Category share breakdowns, month-over-month spend trend comparison, top spenders ranking, and personal contribution metrics.
- **Supabase SSR Authentication**: Protected session routes and verified roommate accounts.
- **Fintech UI Design System**: HSL dark/light modes, Google Fonts (`Bitter`, `Inter`, `JetBrains Mono`), smooth Framer Motion micro-animations.

---

## 🚀 Tech Stack

- **Framework**: Next.js 14+ App Router (TypeScript, RSC & Client components)
- **Styling**: Vanilla CSS with Tailwind CSS v3 utility classes & HSL CSS variable design tokens
- **Database & Auth**: Supabase Postgres & Supabase SSR Auth (`@supabase/ssr`)
- **Form & Validation**: React Hook Form with Zod schemas
- **Animation**: Framer Motion
- **Icons**: Lucide React (`src/lib/icons.ts`)

---

## ⚡ Quick Start & Development

### 1. Prerequisites
- Node.js 18.x or higher
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/kamrakhata.git
cd kamrakhata

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RESEND_API_KEY=your-resend-key
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Room 14 Roommates & Credentials

| Name | Role | Email / Username | Password | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Tatheer** | Room Admin | `admin` / `tatheerabidi00@gmail.com` | `TatheerIsAdmin.123` | Room Admin |
| **Sadam** | Roommate | `sadamhussain09322@gmail.com` | `Sadam123` | Original Roommate |
| **Ahmed Ali** | Roommate | `ahmadyz631@gmail.com` | `Ahmad123` | Original Roommate |
| **Syed Ali Mehdi** | Roommate | `rainbowop786@gmail.com` | `Syed123` | Original Roommate |
| **Muhammad Rohail** | Roommate | `sunnykhan11291@gmail.com` | `Muhammad123` | Original Roommate |
| **Amanullah** | Roommate | `amankhan707022@gmail.com` | `Aman.123` | 6th Roommate (Active Sep 2026) |
| **Aizaz** | Roommate | `aizaz@gmail.com` | `Aizaz.123` | 7th Roommate (Active Sep 2026) |
| **Masood** | Roommate | `masood.haider.bangash1@gmail.com` | `Masood.123` | 8th Roommate (Active Sep 2026) |

---

## 🚢 Deployment on Vercel

1. Push your repository to GitHub.
2. Import your project in Vercel.
3. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Environment Variables.
4. Deploy! Vercel automatically detects Next.js App Router and builds the optimized bundle.

---

## 📜 License
MIT License. Built with ❤️ for Hostel Room 304.
