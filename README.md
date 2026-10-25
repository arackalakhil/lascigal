# Lascigal Convention Centre

A modern, high-performance web platform and Content Management System (CMS) for **Lascigal Convention Centre** (Kalampoor, Muvattupuzha).

Built with Next.js 14 (App Router), Supabase PostgreSQL, and Cloudflare R2 object storage.

---

## 🏛 Architecture & Stack

```text
Visitor / Client
  │
  ├─► Vercel (Next.js 14 App Router) — Frontend, Server Components, API routes & Admin Panel
  │
  ├─► Supabase (PostgreSQL) — Text data, bookings, event records, facilities & site settings
  │
  └─► Cloudflare R2 — 100% of high-resolution images, banners & gallery assets (Zero egress bandwidth fees)
```

* **Frontend**: Next.js 14 (App Router, TypeScript), Responsive CSS
* **Database**: PostgreSQL on Supabase via Prisma ORM
* **Media Storage**: Cloudflare R2 with immutable caching (`max-age=31536000, immutable`)
* **Authentication**: NextAuth.js (Credentials Provider) for single-admin dashboard
* **Admin CMS (`/admin`)**:
  * Brand Identity: 1-click Logo & Favicon upload to R2, Site Title & SEO meta
  * Hero & Banners: Background photo uploader, headlines, and discount offer bar
  * Facilities: Manage 6 core venue highlights with photos & descriptions
  * Event Services: Full CRUD for weddings, receptions, conferences, and celebrations
  * Photo Gallery: Filterable cobbles gallery with multi-category R2 uploads
  * Inquiries Inbox: Real-time customer bookings with Call, WhatsApp, and Email triggers
  * Bulk Media Hub: Browser ZIP extraction with presigned R2 PUT uploads

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js 18.17+ or Node.js 20+
* Cloudflare R2 bucket (`lascigal-media`)
* Supabase PostgreSQL project

### 2. Environment Variables
Create a `.env` file in the project root:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Cloudflare R2
R2_ACCOUNT_ID="your_cloudflare_account_id"
R2_ACCESS_KEY_ID="your_r2_access_key_id"
R2_SECRET_ACCESS_KEY="your_r2_secret_access_key"
R2_BUCKET="lascigal-media"
NEXT_PUBLIC_MEDIA_BASE="https://[YOUR_PUBLIC_R2_DEV_URL].r2.dev"

# Authentication & Admin
NEXTAUTH_SECRET="your_nextauth_secret_key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@lascigal.com"
ADMIN_PASSWORD_HASH="your_bcrypt_hash"
```

### 3. Installation & Run

```bash
# Install dependencies
npm install

# Generate Prisma Client & Push DB schema
npx prisma generate
npx prisma db push

# Seed default settings & content
npm run seed

# Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, or [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the admin panel.

---

## 📦 Production Deployment (Vercel)

1. Push this repository to GitHub.
2. In Vercel, select **Add New Project** and import this repository.
3. Add the environment variables from `.env` in the Vercel dashboard.
4. Set `NEXTAUTH_URL` to your production domain (e.g., `https://lascigal.vercel.app`).
5. Deploy.

---

## 📄 License
Private & Proprietary. All rights reserved by Lascigal Convention Centre.
