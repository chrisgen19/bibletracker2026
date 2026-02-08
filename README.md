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
│   │   └── page.tsx                # Main tracker (protected)
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
│   ├── calendar.tsx                # Monthly calendar view
│   ├── activity-log.tsx            # Daily reading log panel
│   ├── entry-card.tsx              # Reading entry display
│   ├── entry-form.tsx              # Log reading modal form
│   └── stats.tsx                   # Stats cards
├── lib/
│   ├── auth.ts                     # NextAuth configuration
│   ├── db.ts                       # Prisma client singleton
│   ├── ulid.ts                     # ULID ID generation
│   ├── types.ts                    # TypeScript interfaces
│   ├── mock-data.ts                # Sample data
│   ├── constants.ts                # Bible books list
│   ├── constants/
│   │   └── countries.ts            # Country list
│   └── validations/
│       └── auth.ts                 # Zod schemas
├── types/
│   └── next-auth.d.ts              # NextAuth type augmentation
├── env.ts                          # Environment variable validation
└── middleware.ts                   # Route protection
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun run build` | Create production build |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint |
| `bunx prisma migrate dev` | Run database migrations |
| `bunx prisma studio` | Open Prisma database GUI |
| `bunx prisma generate` | Regenerate Prisma client |

## Features

- **Calendar View** - Visual monthly calendar showing reading activity
- **Reading Log** - Log book, chapter, verses, and personal reflections
- **Streak Tracking** - Track consecutive days of reading
- **Progress Stats** - Total entries and books started out of 66
- **Authentication** - Email/password signup and login
- **Route Protection** - Dashboard requires authentication
- **ULID IDs** - Time-sortable unique identifiers for users
- **Form Validation** - Client and server-side validation with Zod
