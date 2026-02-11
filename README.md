# Sola Scriptura - Bible Reading Tracker

A web application to track your daily Bible reading journey. Log chapters and verses, write personal reflections, track reading streaks, and monitor your progress across all 66 books.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL with Prisma 7
- **Authentication:** NextAuth v5 (Auth.js) with Credentials provider
- **Validation:** Zod
- **Icons:** Lucide React
- **Package Manager:** Bun

## Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- [PostgreSQL](https://www.postgresql.org/) (v14+)
- [Docker](https://www.docker.com/) (optional, for running PostgreSQL)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd bibletrackerjs2026
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgres://myuser:mypassword@localhost:5432/bibletracker2026"
AUTH_SECRET="your-secret-key-here"
```

To generate an `AUTH_SECRET`:

```bash
bunx auth secret
```

### 4. Set up the database

If using Docker:

```bash
docker run --name bibletracker-db \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=bibletracker2026 \
  -p 5432:5432 \
  -d postgres:16
```

### 5. Run database migrations

```bash
bunx prisma migrate dev --name init
```

This creates all the necessary tables (users, accounts, sessions, verification_tokens).

### 6. Start the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout with SessionProvider
│   ├── globals.css                 # Global styles
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard (Server Component, fetches entries)
│   │   ├── actions.ts              # Server actions (CRUD for reading entries)
│   │   └── loading.tsx             # Dashboard loading skeleton
│   ├── friends/
│   │   ├── page.tsx                # Friends page (Server Component)
│   │   └── actions.ts              # Server actions (follow, unfollow, search)
│   ├── profile/
│   │   ├── page.tsx                # Profile page (Server Component)
│   │   ├── actions.ts              # Server actions (profile update, password change)
│   │   └── loading.tsx             # Profile loading skeleton
│   ├── u/[username]/
│   │   ├── page.tsx                # Public profile page (Server Component)
│   │   └── not-found.tsx           # 404 for missing usernames
│   ├── signup/
│   │   └── page.tsx                # Registration page
│   ├── login/
│   │   ├── page.tsx                # Login page
│   │   └── login-form.tsx          # Login form component
│   ├── changelog/
│   │   └── page.tsx                # Changelog / version history page
│   └── api/auth/
│       ├── [...nextauth]/route.ts  # NextAuth API handler
│       └── signup/route.ts         # Signup API endpoint
├── components/
│   ├── ui/
│   │   ├── button.tsx              # Reusable button
│   │   └── modal.tsx               # Reusable modal
│   ├── providers/
│   │   └── session-provider.tsx    # NextAuth session wrapper
│   ├── navbar.tsx                  # Navigation bar (desktop + mobile menu)
│   ├── dashboard-client.tsx        # Dashboard client component (interactive state)
│   ├── profile-client.tsx          # Profile page client component
│   ├── calendar.tsx                # Monthly calendar view
│   ├── activity-log.tsx            # Daily reading log panel
│   ├── entry-card.tsx              # Reading entry card with edit/delete
│   ├── entry-form.tsx              # Log/edit reading modal form
│   ├── friends-client.tsx          # Friends page client component
│   ├── friend-card.tsx             # Reusable user card with follow button
│   ├── friend-entry-card.tsx       # Entry card for friends activity feed
│   ├── public-profile-client.tsx   # Public profile client component
│   ├── stats.tsx                   # Stats cards
│   └── skeletons.tsx               # Loading skeleton components
├── lib/
│   ├── auth.ts                     # NextAuth configuration
│   ├── db.ts                       # Prisma client singleton
│   ├── ulid.ts                     # ULID ID generation
│   ├── types.ts                    # TypeScript interfaces
│   ├── stats.ts                    # Shared stats computation
│   ├── changelog.ts                # App version and changelog data
│   ├── mock-data.ts                # Sample data (unused, kept for reference)
│   ├── constants.ts                # Bible books list, abbreviations, and reference formatter
│   ├── constants/
│   │   └── countries.ts            # Country list
│   └── validations/
│       ├── auth.ts                 # Auth Zod schemas (signup, login)
│       └── profile.ts              # Profile Zod schemas (update, password change)
├── types/
│   └── next-auth.d.ts              # NextAuth type augmentation
├── env.ts                          # Environment variable validation
└── middleware.ts                   # Route protection

scripts/
├── db-migrate-safe.sh              # Auto-recover failed migrations before deploying
└── reset-password.ts               # Admin CLI to reset user passwords

prisma/
├── schema.prisma                   # Database schema (User, ReadingEntry, Follow, Notification, CalendarDisplayMode enum)
├── seed.ts                         # Seed script (imports from legacy SQL dump)
└── migrations/                     # Prisma migration history
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun run build` | Create production build |
| `bun start` | Run safe migration + start production server |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run check` | Run lint + typecheck |
| `bun run db:seed` | Seed database from legacy SQL dump |
| `bun run db:reset-password` | Reset a user's password (admin CLI) |
| `bun run db:migrate:safe` | Auto-recover failed migrations + deploy |
| `bunx prisma migrate dev` | Run database migrations (development) |
| `bunx prisma studio` | Open Prisma database GUI |
| `bunx prisma generate` | Regenerate Prisma client |

## Features

- **Calendar View** - Visual monthly calendar showing reading activity
- **Calendar Verse References** - Display abbreviated verse references (e.g., "Rev 2:1-10") directly on calendar days with entry count indicators
- **Calendar Display Modes** - Customize calendar appearance with three options: References with Dots (default), Dots Only, or References Only
- **Reading Log** - Log book, chapter, verses, and personal reflections with responsive UI
- **Mobile-Optimized Entry Logging** - Floating "+ Log Entry" button on mobile devices for quick access
- **Edit & Delete Entries** - Edit existing entries and delete with confirmation; buttons always visible for touch screen accessibility
- **Missed Days Highlight** - Past calendar days with no reading entries are highlighted in red, with a toggle setting to disable
- **Friends Activity Notes** - View personal reflections from friends' reading entries in the activity feed
- **Friends Activity Pagination** - Friends activity feed shows 6 cards at a time with a "Load More" button
- **Version Footer & Changelog** - App version displayed in footer with a link to the changelog page at `/changelog`
- **Follow Notifications** - Bell icon with badge for new follower notifications
- **Streak Tracking** - Track consecutive days of reading
- **Progress Stats** - Total entries and books started out of 66
- **Profile Management** - Edit personal info and change password
- **Layout Settings** - Customize UI preferences including calendar display mode and missed days highlight
- **Toast Notifications** - Success/error feedback on all actions (sonner)
- **Loading Skeletons** - Smooth loading states for dashboard and profile
- **Mobile Navigation** - Responsive hamburger menu with streak, profile, and sign out
- **Admin Password Reset** - CLI tool to reset user passwords
- **Server Actions** - CRUD operations via React Server Actions with optimistic UI
- **Authentication** - Email/password signup and login
- **Public Profiles** - Share reading stats, calendar, and recent entries at `/u/[username]`
- **Profile Privacy** - Opt-out toggle to make your profile private
- **Friends/Follow System** - One-way follow system to connect with other readers
- **Friends Activity Feed** - See followed users' recent reading entries in the Activity Log
- **Route Protection** - Dashboard, profile, and friends pages require authentication
- **ULID IDs** - Time-sortable unique identifiers
- **Form Validation** - Client and server-side validation with Zod
- **Safe Migrations** - Auto-recover failed Prisma migrations on deploy
- **Data Seeding** - Import reading history from legacy SQL dumps
- **Deployed** - Production deployment on Coolify

## Roadmap

### ~~Phase 1 - Core Functionality~~ (Done)

- [x] **Connect dashboard to database** - Replace mock data with real Prisma queries (CRUD for reading entries)
- [x] **Associate entries with users** - Added `ReadingEntry` model with `userId` foreign key
- [x] **Server actions** - Create, read, update, and delete entries via server actions
- [x] **Persist streak and stats** - Calculate streaks and stats from actual database records
- [x] **Edit and delete entries** - Edit entries inline, delete with confirmation modal
- [x] **Data migration** - Seed script to import legacy data from SQL dumps
- [x] **Production deployment** - Deployed to Coolify with safe migration recovery

### ~~Phase 2 - User Experience~~ (Done)

- [x] **Profile page** - View and edit account details (name, username, phone, country, gender, birthday)
- [x] **Change password** - Change password from profile page (current + new password)
- [x] **Layout settings** - Customize calendar display mode and missed days highlight toggle
- [x] **Admin password reset** - CLI script to reset passwords without email
- [x] **Loading skeletons** - Loading states for dashboard and profile pages
- [x] **Toast notifications** - Success/error feedback using sonner
- [x] **Mobile responsive nav** - Hamburger menu with streak, profile link, and sign out
- [x] **Mobile-optimized entry logging** - Floating "+ Log Entry" button for quick access on mobile
- [x] **Missed days highlight** - Visual indicator on calendar for days with no reading (can be toggled off)
- [x] **Touch-friendly buttons** - Edit/delete buttons always visible (no hover required)
- [x] **Friends activity notes** - Display notes/reflections on friend activity cards
- [x] **Friends activity pagination** - Load 6 cards at a time with "Load More" button
- [x] **Version footer & changelog** - Version display in footer with changelog page
- [x] **Follow notifications** - Bell icon with badge and followers tab on friends page
- [ ] **Email verification** - Verify email address on signup (pending SMTP setup)
- [ ] **Password reset flow** - Forgot password with email verification (pending SMTP setup)

### Phase 3 - Reading Features

- [ ] **Reading plans** - Predefined plans (e.g., Bible in a year, Gospels in 30 days)
- [ ] **Chapter-level tracking** - Track exactly which chapters have been read per book
- [ ] **Progress bar per book** - Visual completion percentage for each book
- [ ] **Favorites / bookmarks** - Save favorite verses or passages
- [ ] **Search entries** - Search through past reflections and notes
- [ ] **Export data** - Download reading history as CSV or PDF

### Phase 4 - Prayer & Spiritual Life

#### Core Prayer Features
- [ ] **Prayer model** - Database schema for prayer entries (title, description, category, date, answered status)
- [ ] **Create/edit/delete prayers** - Full CRUD operations for prayer management
- [ ] **Prayer categories** - Organize prayers by type (Personal, Family, Friends, Church, Missions, Health, Work, etc.)
- [ ] **Mark prayers as answered** - Track answered prayers with date and testimony notes
- [ ] **Prayer journal** - Rich text notes and updates for ongoing prayers
- [ ] **Calendar integration** - Display prayer indicators on calendar alongside reading entries
- [ ] **Active prayers view** - Dedicated page showing all ongoing/unanswered prayers
- [ ] **Answered prayers archive** - Celebrate and review God's faithfulness

#### Social Prayer Features
- [ ] **Prayer privacy settings** - Choose visibility per prayer (Public, Friends Only, Private)
- [ ] **Friends prayer feed** - See friends' public prayers in the activity log
- [ ] **Prayer support** - "Praying for this" button to let friends know you're praying
- [ ] **Answered prayer celebrations** - Friends see when prayers are marked as answered
- [ ] **Prayer requests** - Specific flag for prayers that need community support

#### Advanced Prayer Features
- [ ] **Prayer reminders** - Daily/weekly reminders for specific prayers
- [ ] **Prayer streaks** - Track consistency in prayer life
- [ ] **Search prayers** - Full-text search across prayer journal
- [ ] **Export prayer journal** - Download prayer history as PDF or CSV
- [ ] **Prayer statistics** - Track answered vs. pending prayers, categories breakdown
- [ ] **Prayer plans** - Structured prayer guides (30-day prayer challenge, denominational prayer books, etc.)

### Phase 5 - Social & Community

- [x] **Public profiles** - Share reading stats with others
- [x] **Friends/follow system** - Follow other readers and see their activity
- [ ] **Reading groups** - Join or create accountability groups
- [ ] **Shared reading plans** - Follow plans together with friends
- [ ] **Prayer groups** - Shared prayer lists for accountability groups
- [ ] **Group prayer requests** - Submit and track group prayers
- [ ] **Leaderboard** - Optional streak and progress leaderboards

### Phase 6 - Polish & Deployment

- [ ] **Go-live SEO switch** - Remove temporary `noindex, nofollow` from `src/app/layout.tsx` and update `src/app/robots.ts` to allow crawling when the app is publicly launched
- [ ] **Dark mode** - Toggle between light and dark themes
- [ ] **PWA support** - Install as a mobile app with offline access
- [ ] **Push notifications** - Daily reading reminders
- [ ] **Analytics dashboard** - Reading trends, weekly/monthly summaries
- [ ] **Rate limiting** - Protect auth endpoints from brute force
- [ ] **CI/CD pipeline** - Automated testing and deployment
