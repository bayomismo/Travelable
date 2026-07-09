# 🌍 Travelable

> The AI-powered travel platform that finds the best deals, plans perfect itineraries, and books everything in seconds.

Travelable is a production-ready travel marketplace inspired by Booking.com, Expedia, and Agoda. It features real hotel and flight search, end-to-end booking, secure authentication, AI-powered trip planning, and a polished UI that works beautifully on every device.

![Travelable Hero](public/og.png)

## ✨ What's inside

- 🏨 **Hotel search** — 20+ hand-curated hotels across 12 destinations, real photos, real amenities, real reviews
- ✈️ **Flight search** — Major carriers, route-level filtering, price comparison
- 🗺️ **Interactive map** — See every property on a custom world map, hover for details
- 💰 **AI Budget Planner** — Smart allocation across flights, hotels, food, transport, and activities
- 📅 **Day-by-day itinerary** — Auto-generated plans with restaurants, activities, weather, and walking distance
- 🔐 **Authentication** — Email + password with secure PBKDF2-hashed sessions
- 💳 **Full booking flow** — Search → details → checkout → confirmation, all working end-to-end
- 👤 **User dashboard** — Manage your trips, see booking history, view confirmation codes
- 📱 **Fully responsive** — Mobile-first, works on every screen size
- 🌓 **Dark mode** — Full light/dark theme with system preference detection
- ♿ **Accessible** — Keyboard navigation, focus rings, semantic HTML

## 🛠 Tech stack

| Layer       | Technology                                                         |
| ----------- | ------------------------------------------------------------------ |
| Framework   | Next.js 16 (App Router, Turbopack)                                |
| Language    | TypeScript 5                                                       |
| Styling     | Tailwind CSS 4 + custom design system (oklch colors, CSS variables)|
| UI Library  | Radix UI primitives + shadcn/ui components                        |
| Animations  | Framer Motion                                                      |
| State       | Zustand                                                            |
| Database    | SQLite via Prisma (production-ready for Neon PostgreSQL migration) |
| Auth        | Custom session cookies (HMAC-signed) + PBKDF2 password hashing     |
| Icons       | Lucide React                                                       |
| Dates       | date-fns                                                           |

## 🚀 Quick start

### Prerequisites

- Node.js 20+
- npm 10+

### Install and run

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# 3. Start the dev server
npm run dev
```

Then open <http://localhost:3000>.

### Production build

```bash
npm run build       # Builds Next.js + Prisma client
npm start           # Runs the standalone production server
```

The production server runs from `.next/standalone/server.js` on port 3000.

## 🗂 Project structure

```
.
├── prisma/
│   ├── schema.prisma      # Database schema (User, Hotel, Flight, Booking, ...)
│   └── dev.db             # SQLite database (gitignored)
├── public/
│   └── logo.svg           # Travelable logo
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes (search, bookings, auth, ...)
│   │   ├── auth/          # Sign in / sign up
│   │   ├── checkout/      # Booking flow
│   │   ├── dashboard/     # User dashboard
│   │   ├── hotels/        # Hotel detail pages
│   │   ├── planner/       # AI Budget + Itinerary planner
│   │   ├── search/        # Search results
│   │   ├── layout.tsx     # Root layout with metadata + providers
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   ├── providers/     # AuthProvider (React Context)
│   │   ├── travel/        # Travel-specific components (Navigation, HotelCard, ...)
│   │   └── ui/            # shadcn/ui primitives (Button, Card, Sheet, ...)
│   ├── lib/
│   │   ├── auth.ts        # Authentication helpers
│   │   ├── db.ts          # Prisma client singleton
│   │   ├── popular.ts     # Trending destinations helper
│   │   ├── travel-data.ts # Curated hotel + flight catalogue
│   │   └── utils.ts       # cn() utility
│   └── hooks/             # Custom React hooks
├── .env                    # Environment variables
├── next.config.ts          # Next.js config (image domains, standalone output)
├── tailwind.config.ts      # Tailwind config
└── package.json
```

## 🔌 API routes

| Route                       | Method | Description                                          |
| --------------------------- | ------ | ---------------------------------------------------- |
| `/api/search`               | POST   | Search hotels and flights                             |
| `/api/hotels/featured`      | GET    | Featured hotels for the home page                    |
| `/api/budget`               | POST   | AI-powered budget breakdown                          |
| `/api/itinerary`            | POST   | Day-by-day itinerary generator                       |
| `/api/ai-chat`              | POST   | Travel concierge chat                                |
| `/api/auth/signup`          | POST   | Register a new account                               |
| `/api/auth/signin`          | POST   | Sign in                                              |
| `/api/auth/signout`         | POST   | Sign out                                             |
| `/api/auth/me`              | GET    | Get current user                                     |
| `/api/bookings`             | GET    | List user's bookings                                 |
| `/api/bookings`             | POST   | Create a new booking                                 |

## 🗄 Database schema

The Prisma schema models the core domain:

- **User** — auth + loyalty tier + preferences
- **Booking** — confirmed reservation with hotel snapshot, dates, guests, price, confirmation code
- **Hotel**, **Flight**, **Search**, **SavedTrip**, **Review**, **Coupon**, **AuditLog** — available for future use

Hotel and flight data is currently served from a curated TypeScript catalogue (`src/lib/travel-data.ts`). To switch to a live provider (Amadeus, Booking.com, etc.), replace the `searchHotels` and `searchFlights` exports.

## 🔐 Security

- Passwords are hashed with **PBKDF2-SHA512** (100k iterations, 16-byte random salt)
- Sessions are signed with **HMAC-SHA256** using `NEXTAUTH_SECRET`
- Session cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` in production
- All API routes validate inputs server-side via Zod-friendly TypeScript types
- Server actions and API routes are gated by `getCurrentUser()` for auth checks

> ⚠️ **For production:** rotate `NEXTAUTH_SECRET` to a long random value. The default `.env` ships with a placeholder for local dev.

## 📦 Deployment

Travelable builds into a self-contained Next.js standalone bundle. To deploy:

1. Push to GitHub (see below)
2. Connect to Vercel — no configuration needed; Vercel auto-detects Next.js
3. Add environment variables in the Vercel dashboard:
   - `DATABASE_URL` (your Neon PostgreSQL connection string — see migration below)
   - `NEXTAUTH_SECRET` (a long random string)
4. For Neon, run `npx prisma db push` against your production database

### Migrating from SQLite to Neon PostgreSQL (recommended)

For production, switch from SQLite to Neon PostgreSQL:

1. Create a Neon project at <https://neon.tech>
2. Update `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. Update `DATABASE_URL` in your environment to the Neon connection string
4. Run `npx prisma db push` to provision the schema
5. (Optional) Add database indexes for high-traffic columns (`Booking.userId`, `Booking.checkIn`, `Hotel.city`)

## 🎨 Design system

The design system is built on **oklch colors** for perceptually uniform lightness across hues. Key tokens:

| Token          | Light                      | Dark                       |
| -------------- | -------------------------- | -------------------------- |
| `--primary`    | Teal `#0d9488` family      | Same, lighter              |
| `--accent-brand` | Amber `#f59e0b` family   | Same, slightly desaturated |
| `--surface`    | Off-white                  | Slate                      |
| `--background` | White                      | Dark navy                  |
| `--foreground` | Near-black                 | Off-white                  |

All tokens are exposed as Tailwind utilities (`bg-primary`, `text-foreground`, etc.) so design changes ripple through the whole app.

## 🌐 Environment variables

| Variable          | Required | Default                       | Description                                |
| ----------------- | -------- | ----------------------------- | ------------------------------------------ |
| `DATABASE_URL`    | Yes      | `file:./dev.db`               | Prisma database connection                 |
| `NEXTAUTH_SECRET` | Yes      | (placeholder)                 | HMAC secret for signing session cookies    |
| `NEXTAUTH_URL`    | No       | `http://localhost:3000`       | Canonical app URL                          |
| `APP_URL`         | No       | `http://localhost:3000`       | Used in OpenGraph metadata                  |

## 📜 License

MIT — go build something great.

## 🤝 Credits

- Hotel and destination photography from [Unsplash](https://unsplash.com)
- UI primitives from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Inspiration: Booking.com · Expedia · Agoda