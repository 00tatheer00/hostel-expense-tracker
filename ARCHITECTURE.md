# KamraKhata Architectural Specification

## System Overview

KamraKhata follows a feature-based layered architecture separating concerns into presentation, business services, repositories, and Supabase data access.

```
src/
├── app/                  # Next.js App Router Page Routes
├── components/           # Reusable UI & Layout Design System Components
├── features/             # Feature Modules (auth, expenses, dashboard, settlements, analytics, profile, settings)
├── services/             # Core Backend Services & Calculation Engines
│   ├── balance.service.ts              # Real-time net balance engine
│   ├── settlement-algorithm.service.ts # Minimum cash flow debt optimizer
│   └── repositories/                   # Data Access Repositories
├── providers/            # React Context Providers (AuthProvider, ThemeProvider)
├── lib/                  # Library configurations (Supabase clients, icons, motion)
├── types/                # Strongly typed interfaces & database contracts
└── utils/                # Calculation utilities & formatters
```

---

## 🧮 Dynamic Balance Engine Specifications

Net balances in KamraKhata are **never stored** in database columns to eliminate race conditions and data synchronization bugs.

$$\text{Net Balance}_i = \text{Total Paid}_i - \text{Total Owed}_i + \text{Settled Paid}_i - \text{Settled Received}_i$$

1. $\text{Total Paid}_i$: Sum of all expense amounts paid out by user $i$.
2. $\text{Total Owed}_i$: Sum of all expense split shares assigned to user $i$.
3. $\text{Settled Paid}_i$: Direct payments transferred by user $i$ to other roommates.
4. $\text{Settled Received}_i$: Direct payments received by user $i$ from other roommates.

---

## 🤖 Smart Settlement Engine Algorithm

The `SettlementAlgorithmService` uses a greedy debt minimization algorithm:
1. Calculates net balance $B_i$ for all 6 roommates.
2. Identifies maximum creditor ($C_{max}$, highest positive balance) and maximum debtor ($D_{max}$, highest negative balance).
3. Computes transfer amount $M = \min(|B(D_{max})|, B(C_{max}))$.
4. Updates net balances $B(C_{max}) \leftarrow B(C_{max}) - M$ and $B(D_{max}) \leftarrow B(D_{max}) + M$.
5. Repeats recursively until all balances reach 0.
