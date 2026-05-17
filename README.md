# 💊 PillCare — Medication Reminder PWA

A modern, mobile-first Progressive Web Application for medication reminders and tracking, built with Next.js, PostgreSQL, Tailwind CSS, shadcn/ui, and Framer Motion.

## Features

- **Dashboard** — today's medications, progress ring, streak counter
- **Medication Management** — add, edit, delete with color coding
- **Flexible Schedules** — daily, twice/thrice daily, weekly, custom days
- **Medication History** — full log with filter by status
- **Calendar View** — monthly view with color-coded completion dots
- **Push Notifications** — browser/mobile push via Web Push API
- **PWA** — installable on mobile, offline support
- **Multilingual** — Ukrainian (default), Russian, English
- **Dark / Light / System** theme
- **Gamification** — streak counter, confetti celebration

## Tech Stack

- **Framework**: Next.js 16 App Router
- **Database**: PostgreSQL via Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **PWA**: next-pwa (Workbox)
- **Push Notifications**: Web Push API
- **State Management**: Zustand

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/pillcare"
```

For push notifications, generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```

### 3. Set up database

```bash
# Create database
createdb pillcare

# Run migrations
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed demo data (optional)
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── (app)/              # Main app pages (with bottom nav)
│   ├── dashboard/      # Today's medications & progress
│   ├── medications/    # Medication list, add, edit
│   ├── calendar/       # Monthly calendar view
│   ├── history/        # Intake history & stats
│   └── settings/       # Language, theme, notifications
├── api/                # REST API routes
│   ├── dashboard/      # Dashboard data + auto-generate daily entries
│   ├── medications/    # CRUD for medications
│   ├── history/        # History entries
│   ├── calendar/       # Calendar stats
│   └── notifications/  # Push subscription & send
└── page.tsx            # Landing page

components/
├── layout/             # BottomNav, PageHeader
├── medications/        # MedCard, MedForm, MedTodayCard
└── ui/                 # shadcn components + confetti

lib/
├── db.ts               # Prisma client
├── store.ts            # Zustand app state
├── utils.ts            # Helpers
└── i18n/               # Translations (uk, ru, en)

prisma/
└── schema.prisma       # Database schema
```

## Database Schema

- **User** — preferences, language, theme, push subscription
- **Medication** — name, dosage, unit, color, stock
- **Schedule** — frequency, times, weekdays
- **MedicationHistory** — per-dose tracking with status (PENDING/TAKEN/SKIPPED/MISSED)

## PWA Icons

Replace placeholder SVG icons in `public/icons/` with proper PNG icons.
Use https://realfavicongenerator.net/ or https://pwabuilder.com/

## Push Notifications

1. Generate VAPID keys: `npx web-push generate-vapid-keys`
2. Add to `.env.local`
3. Enable in Settings → Notifications

## Languages

Switch language in **Settings → Language**. Saves to localStorage automatically.

## Demo Mode

Without a database, the app gracefully shows empty states. Set `DATABASE_URL` to enable full functionality.
