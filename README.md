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
│   │   └── actions.ts              # Server actions (CRUD for reading entries)
│   ├── signup/
│   │   └── page.tsx                # Registration page
│   ├── login/
│   │   ├── page.tsx                # Login page
│   │   └── login-form.tsx          # Login form component
│   └── api/auth/
│       ├── [...nextauth]/route.ts  # NextAuth API handler
│       └── signup/route.ts         # Signup API endpoint
├── components/
│   ├── ui/
│   │   ├── button.tsx              # Reusable button
│   │   └── modal.tsx               # Reusable modal
│   ├── providers/
│   │   └── session-provider.tsx    # NextAuth session wrapper
│   ├── navbar.tsx                  # Navigation bar
│   ├── dashboard-client.tsx        # Dashboard client component (interactive state)
│   ├── calendar.tsx                # Monthly calendar view
│   ├── activity-log.tsx            # Daily reading log panel
│   ├── entry-card.tsx              # Reading entry card with edit/delete
│   ├── entry-form.tsx              # Log/edit reading modal form
│   └── stats.tsx                   # Stats cards
├── lib/
│   ├── auth.ts                     # NextAuth configuration
│   ├── db.ts                       # Prisma client singleton
│   ├── ulid.ts                     # ULID ID generation
│   ├── types.ts                    # TypeScript interfaces
│   ├── mock-data.ts                # Sample data (unused, kept for reference)
│   ├── constants.ts                # Bible books list
│   ├── constants/
│   │   └── countries.ts            # Country list
│   └── validations/
│       └── auth.ts                 # Zod schemas
├── types/
│   └── next-auth.d.ts              # NextAuth type augmentation
├── env.ts                          # Environment variable validation
└── middleware.ts                   # Route protection

scripts/
└── db-migrate-safe.sh              # Auto-recover failed migrations before deploying

prisma/
├── schema.prisma                   # Database schema (User, ReadingEntry models)
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
| `bun run db:migrate:safe` | Auto-recover failed migrations + deploy |
| `bunx prisma migrate dev` | Run database migrations (development) |
| `bunx prisma studio` | Open Prisma database GUI |
| `bunx prisma generate` | Regenerate Prisma client |

## Features

- **Calendar View** - Visual monthly calendar showing reading activity
- **Reading Log** - Log book, chapter, verses, and personal reflections
- **Edit & Delete Entries** - Edit existing entries and delete with confirmation
- **Streak Tracking** - Track consecutive days of reading
- **Progress Stats** - Total entries and books started out of 66
- **Server Actions** - CRUD operations via React Server Actions with optimistic UI
- **Authentication** - Email/password signup and login
- **Route Protection** - Dashboard requires authentication
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

### Phase 2 - User Experience

- [ ] **Profile page** - View and edit account details (name, avatar, country, etc.)
- [ ] **Password reset flow** - Forgot password with email verification
- [ ] **Email verification** - Verify email address on signup
- [ ] **Loading skeletons** - Add loading states for calendar and activity log
- [ ] **Toast notifications** - Success/error feedback for user actions
- [ ] **Mobile responsive nav** - Expand the mobile hamburger menu with full navigation

### Phase 3 - Reading Features

- [ ] **Reading plans** - Predefined plans (e.g., Bible in a year, Gospels in 30 days)
- [ ] **Chapter-level tracking** - Track exactly which chapters have been read per book
- [ ] **Progress bar per book** - Visual completion percentage for each book
- [ ] **Favorites / bookmarks** - Save favorite verses or passages
- [ ] **Search entries** - Search through past reflections and notes
- [ ] **Export data** - Download reading history as CSV or PDF

### Phase 4 - Social & Community

- [ ] **Public profiles** - Share reading stats with others
- [ ] **Reading groups** - Join or create accountability groups
- [ ] **Shared reading plans** - Follow plans together with friends
- [ ] **Leaderboard** - Optional streak and progress leaderboards

### Phase 5 - Polish & Deployment

- [ ] **Dark mode** - Toggle between light and dark themes
- [ ] **PWA support** - Install as a mobile app with offline access
- [ ] **Push notifications** - Daily reading reminders
- [ ] **Analytics dashboard** - Reading trends, weekly/monthly summaries
- [ ] **Rate limiting** - Protect auth endpoints from brute force
- [ ] **CI/CD pipeline** - Automated testing and deployment
