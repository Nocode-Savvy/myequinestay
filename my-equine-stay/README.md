# My Equine Stay 🐎

> Premium, resellable SaaS marketplace connecting horse owners and traveling equestrians with short-term stays, barns, and RV pads in Florida.

![Next.js 14+](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=flat&logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Test%20%26%20Live%20Ready-635bff?style=flat&logo=stripe)

---

## 🌟 Highlights

- **Elevated Brand Aesthetic**: Warm cream background, deep forest green primary tones, and refined equestrian gold accents.
- **Micro-interactions & Animations**: Built-in Framer Motion scroll-reveal triggers, hover lifts, interactive filter drawer transitions, and accordion dropdowns.
- **Robust Map Integration**: Working Mapbox GL JS map view with custom price markers and approximate area radius to protect host biosecurity.
- **9-Step Owner Wizard**: Multi-step listing creator with interactive coordinate picker, facility checklists, drag-to-reorder photo gallery, and Stripe subscription checkout.
- **Dedicated Admin Console (`/admin`)**:
  - Live revenue & signup analytics with Recharts
  - User role management & account suspension
  - Listings moderation with featured stay spotlight controls
  - Stripe transaction history & refund trigger stubs
  - Config-driven platform branding settings
- **Master Template Architecture**: No hardcoded buyer names or secrets. Easily white-labeled and deployed for new clients.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
bun install
# or
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(The app runs in offline demo mode even before setting live Supabase/Stripe keys!)*

### 3. Run Development Server
```bash
bun run dev
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗄️ Database Migrations

Apply the migration files in `supabase/migrations/` using the Supabase SQL editor:
1. `001_schema.sql` — Schema definition, triggers, and helper functions
2. `002_rls.sql` — Row-Level Security policies
3. `003_seed.sql` — Seed listings across Ocala and Central Florida

---

## 📖 Documentation

- [System Architecture](docs/architecture.md)
- [Buyer Deployment Guide](docs/deployment.md)
- [Security & RLS Overview](docs/security.md)

---

## 📄 License
Commercial License · Proprietary Master Template
