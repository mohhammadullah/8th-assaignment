<div align="center">

# 🎬 StudioSpace

### *Where Creativity Finds Its Space.*

A peer-to-peer creative studio rental marketplace — discover, book, and list
photo studios, sound stages, podcast rooms, music suites, and workspaces by the hour.

[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8.svg)](https://tailwindcss.com)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.7-emerald.svg)](https://www.better-auth.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com)

**[🌐 Live Demo — https://studio-space-pearl.vercel.app](https://studio-space-pearl.vercel.app/)**

**Backend API:** [https://studio-space-server-olive.vercel.app](https://studio-space-server-olive.vercel.app) · Health: [`/api/health`](https://studio-space-server-olive.vercel.app/api/health)

</div>

---

## 📖 About

**StudioSpace** connects creators who need production space (photographers,
filmmakers, podcasters, musicians, workshop hosts) with hosts who can rent
it by the hour.

- **The problem:** creative professionals waste hours coordinating studio
  access, gear, and pricing over messages while hosts struggle to get
  discovered.
- **The solution:** a single marketplace where studios carry real hourly
  pricing, capacity, amenities, and photos; bookings are slot-checked
  (no double-booking); and both sides manage everything from one account.

## ✨ Key Features

| Area | What works today |
|---|---|
| Auth | Email/password register & login, Google OAuth, persistent sessions, logout, `ProtectedRoute` guards + server-side `verifyAuth` |
| Discovery | Category browser, keyword-free explore grid, category filter (`?category=`), responsive cards |
| Studios | Details page with booking form, host-a-studio form (`/add-studio`), edit (`/studios/edit/[id]`), delete with confirm modal, "My Listings" |
| Booking | Date + time-slot picker that disables booked slots (checks `/api/bookings/slots`), create booking, cancel, PDF invoice download |
| Extras | Wishlist (heart save/check/remove), user dashboard (stats, recent listings/bookings), Sonner toasts, form validation, resilient images with designed placeholders, empty states |

## 🛠️ Technologies

**Frontend**

| | |
|---|---|
| Framework | Next.js 16 (App Router, `cacheComponents`, `partialPrefetching`, React Compiler) + React 19 + TypeScript |
| Styling / UI | Tailwind CSS v4, shadcn-style components on `@base-ui/react`, Lucide icons, Sonner, Framer Motion, Swiper |
| Auth client | `better-auth/react` (`createAuthClient`) |
| Build | Turbopack, ESLint (`eslint-config-next`) |

**Backend API** ([repo](https://github.com/mohhammadullah/8th-assaignment-server)): Node 22+ / Express 5 (ESM, `node index.js`), MongoDB Node driver, `cors`, `cookie-parser`, deployed as a Vercel serverless function.

**Database:** MongoDB Atlas (`studio-space` — studios, bookings, wishlist + Better Auth `user`/`session`/`account`/`verification`).

**Authentication:** Better Auth 1.7 — email/password + Google social provider, `Secure; SameSite=None` cookies, trusted origins.

**Deployment:** Vercel (frontend + backend), MongoDB Atlas.

## 📸 Screenshots

> No screenshots are committed yet (no matching assets in `public/` beyond
> default Next.js icons). To add them: capture the live homepage, explore
> page, and studio details page, save as `docs/screenshot-*.png`, then
> reference them here, e.g.:
>
> ```md
> <p align="center"><img src="docs/screenshot-home.png" width="80%" /></p>
> ```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 20+ · npm
- MongoDB Atlas cluster (or local MongoDB)
- Google Cloud OAuth 2.0 client (for Google login)

### 1. Clone & install

```bash
git clone https://github.com/mohhammadullah/8th-assaignment.git
cd 8th-assaignment
npm install
```

### 2. Configure environment

Create `.env.local` (gitignored — never commit secrets):

```bash
# Frontend — StudioSpace browser app
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
BETTER_AUTH_URL=http://localhost:3000
```

> The actual OAuth session lives on the backend (`/api/auth/*` on
> `NEXT_PUBLIC_API_URL`); `NEXT_PUBLIC_GOOGLE_CLIENT_ID` mirrors the backend
> value for display. Do **not** put `GOOGLE_CLIENT_SECRET` or
> `MONGODB_URI` in any `NEXT_PUBLIC_` variable.

See [Backend README](https://github.com/mohhammadullah/8th-assaignment-server#environment-variables)
for the API env (`MONGODB_URI`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, …).

### 3. Run

```bash
npm run dev     # http://localhost:3000  (dev server)
npm run build   # production build
npm run lint    # eslint
```

Terminal 2 — run the API first:

```bash
git clone https://github.com/mohhammadullah/8th-assaignment-server.git
cd 8th-assaignment-server
npm install
# copy .env.example to .env and fill it in
npm run dev     # http://localhost:5000  (nodemon)
```

### Google OAuth (local)
In Google Cloud Console add **both** redirect URIs for correctness:
- `http://localhost:5000/api/auth/callback/google`
- `https://studio-space-server-olive.vercel.app/api/auth/callback/google`

## 📡 API (high level)

Full contract: [Backend README](https://github.com/mohhammadullah/8th-assaignment-server#api-documentation).

- `GET /api/health` — `{ success, status, db }`
- `GET /api/studios`, `/api/studios/featured`, `/api/studios/:id`, `GET /api/categories`
- `POST /api/studios`, `PUT /api/studios/:id`, `DELETE /api/studios/:id` (+ `GET /api/studios/user/:email`)
- `GET /api/bookings/slots` — `{ bookedSlots }`
- `POST /api/bookings`, `GET /api/bookings/my-bookings`, `DELETE /api/bookings/:id`
- `GET/POST/DELETE /api/wishlist` (+ `GET /api/wishlist/check`)
- Better Auth: `/api/auth/*` (`sign-up/email`, `sign-in/email`, `sign-in/social`, `get-session`, `sign-out`)

## 🗂️ Project Structure

```
studio-space/
├── src/
│   ├── app/            # routes: / /studios /studios/[id] /add-studio /studios/edit/[id]
│   ├── components/    # home • layout • ui / ProtectedRoute • studio-image
│   ├── hooks/          # use-user (AuthProvider)
│   ├── lib/            # api, auth-client, google-auth, db, invoice
│   ├── models/         # studio schema
│   ├── context/ hooks/ middleware (proxy.ts)
│   └── data/           # sample studios (seed source only)
├── public/
├── scripts/seed.mjs    # seeds MongoDB from src/data/sample-studios.json
├── next.config.ts
└── package.json
```

## 🌍 Deployment

- **Frontend (Vercel):** env `NEXT_PUBLIC_API_URL=https://studio-space-server-olive.vercel.app`,
  `BETTER_AUTH_URL=https://studio-space-pearl.vercel.app`. `NEXT_PUBLIC_*` are baked at **build** time → redeploy after changing them.
- **Backend (Vercel serverless, `@vercel/node`):** env `MONGODB_URI`, `MONGODB_DB=studio-space`,
  `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://studio-space-server-olive.vercel.app`,
  `FRONTEND_URL=https://studio-space-pearl.vercel.app`, `GOOGLE_CLIENT_ID/SECRET`. `GET /api/health` confirms DB connectivity.
- **Atlas:** allow the Vercel IP ranges in Network Access.

## 🔮 Future Improvements

- Real photo upload (currently paste-an-https-URL listings) with object storage
- Lazy-load below-fold images, richer gallery on studio details
- Map view, availability calendar, and host payout stats
- Password reset / email verification flows

## 👤 Author

**Gazi Mohammadullah** — [GitHub](https://github.com/mohhammadullah/8th-assaignment) · [GitHub (backend)](https://github.com/mohhammadullah/8th-assaignment-server)

> Built as a full-stack assignment project: Next.js frontend, Express backend,
> Atlas persistence, and Better Auth on Vercel.
