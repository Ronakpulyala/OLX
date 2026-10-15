# 🏷️ Sell — Modern Classifieds Marketplace

> **Buy & Sell Anything Near You** — An open-source OLX alternative built with modern tech stack.

![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React Native](https://img.shields.io/badge/React_Native-Expo_51-blue?logo=expo)
![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+PostGIS-blue?logo=postgresql)

---

## 📖 Overview

**Sell** is a full-stack classifieds marketplace platform where users can buy and sell items locally. Think OLX, but built with a modern, scalable architecture designed for growth.

### Key Features

- 🏠 **Browse Listings** — Discover items near you with location-based search
- 🔍 **Smart Search** — Typo-tolerant, faceted search with sub-50ms response times
- 📸 **Multi-Image Listings** — Post ads with up to 12 photos, auto-compressed
- 💬 **Real-Time Chat** — Secure buyer/seller messaging with read receipts
- ❤️ **Favorites** — Save listings for later
- 📍 **Location-Aware** — PostGIS-powered geospatial queries ("Find within 10km")
- 🛡️ **Moderation** — AI-powered image screening + rule-based fraud detection
- 📱 **Cross-Platform** — Web (SSR for SEO), iOS, and Android

---

## 🏗️ Architecture

```
sell-marketplace/
├── apps/
│   ├── web/          # Next.js 14 (App Router) — SSR web application
│   ├── mobile/       # React Native (Expo 51) — iOS & Android app
│   └── api/          # NestJS — REST API + WebSocket server
├── packages/
│   └── shared-types/ # Shared TypeScript type definitions
├── docker-compose.yml
├── package.json      # Monorepo root (npm workspaces)
└── .env.example
```

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Web Frontend** | Next.js 14 (App Router) + Tailwind CSS | SSR for SEO on listing pages, React ecosystem |
| **Mobile** | React Native (Expo 51) + Expo Router | High code reuse across iOS/Android |
| **Backend API** | NestJS + TypeORM | Modular, enterprise-grade Node.js framework |
| **Database** | PostgreSQL 16 + PostGIS | Location-bound classifieds need geospatial queries |
| **Search** | Typesense | Typo-tolerant, sub-50ms faceted search |
| **Real-Time** | Socket.io (via NestJS WebSocket Gateway) | Buyer/seller chat, notifications |
| **Cache** | Redis | Session store, rate limiting, pub/sub |
| **Media** | Sharp + S3/MinIO + Cloudinary | Image processing, CDN delivery |
| **Moderation** | AWS Rekognition (optional) | Prohibited content detection |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **Docker** & **Docker Compose** (for databases)
- **Expo CLI** (for mobile): `npx expo`

### 1. Clone & Install

```bash
git clone <repo-url> sell-marketplace
cd sell-marketplace
npm install
```

### 2. Start Infrastructure

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL + PostGIS** on port 5432
- **Redis** on port 6379
- **Typesense** on port 8108
- **MinIO** (S3-compatible storage) on port 9000

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Run Database Migrations & Seed

```bash
npm run dev:api
# In another terminal:
# npx ts-node apps/api/src/database/seed.ts
```

### 5. Start Development Servers

```bash
# Start API + Web concurrently
npm run dev

# Start mobile (separate terminal)
npm run dev:mobile
```

| Service | URL |
|---------|-----|
| Web App | http://localhost:3000 |
| API Server | http://localhost:4000 |
| API Docs (Swagger) | http://localhost:4000/api/docs |
| MinIO Console | http://localhost:9001 |

---

## 📱 Mobile App

The mobile app uses **Expo Router** with tab-based navigation:

| Tab | Screen | Description |
|-----|--------|-------------|
| 🏠 Home | Browse Feed | Location-aware listing feed with categories |
| 🔍 Search | Search & Filter | Full-text search with filters |
| ➕ Sell | Post Ad | Multi-step listing creation |
| 💬 Chat | Inbox | Real-time conversations |
| 👤 Profile | Account | User profile, settings, my ads |

```bash
# Start Expo dev server
cd apps/mobile
npx expo start

# Run on specific platform
npx expo run:ios
npx expo run:android
```

---

## 🌐 Web App

The web app uses **Next.js App Router** with SSR for SEO-critical pages:

| Page | Route | SSR |
|------|-------|-----|
| Home | `/` | ✅ |
| Listing Detail | `/listing/[slug]` | ✅ (SEO critical) |
| Search Results | `/search?q=...` | ✅ |
| Post Ad | `/post` | ❌ (client) |
| Chat | `/chat` | ❌ (client) |
| Profile | `/profile/[id]` | ✅ |
| My Ads | `/my-ads` | ❌ (client) |
| Login | `/login` | ❌ (client) |

---

## ⚙️ API Endpoints

### Auth
- `POST /auth/send-otp` — Send OTP to phone
- `POST /auth/verify-otp` — Verify OTP & get tokens
- `POST /auth/refresh-token` — Refresh JWT
- `GET /auth/me` — Get current user

### Listings
- `GET /listings` — List with pagination & filters
- `GET /listings/:slug` — Get listing by slug
- `POST /listings` — Create listing
- `PATCH /listings/:id` — Update listing
- `DELETE /listings/:id` — Delete listing
- `POST /listings/:id/favorite` — Add to favorites
- `DELETE /listings/:id/favorite` — Remove from favorites
- `POST /listings/:id/report` — Report listing

### Search
- `GET /search` — Full-text search with facets

### Categories
- `GET /categories` — Category tree
- `GET /categories/:slug` — Category details

### Chat
- `GET /conversations` — User's conversations
- `GET /conversations/:id/messages` — Conversation messages
- `POST /conversations` — Start conversation
- **WebSocket Events:** `sendMessage`, `markRead`, `typing`

### Users
- `GET /users/:id` — Public profile
- `PATCH /users/me` — Update profile
- `GET /users/:id/listings` — User's listings

### Media
- `POST /media/upload` — Upload images (multipart)

### Notifications
- `GET /notifications` — User's notifications
- `PATCH /notifications/:id/read` — Mark as read
- `PATCH /notifications/read-all` — Mark all as read

---

## 🗄️ Database Schema

The database uses **PostgreSQL with PostGIS** for geospatial queries.

Key tables: `users`, `listings`, `categories`, `listing_images`, `conversations`, `messages`, `favorites`, `notifications`, `reports`

Geospatial features:
- Listings have a PostGIS `GEOGRAPHY(Point, 4326)` column
- Radius search uses `ST_DWithin` for efficient "find within X km" queries
- Spatial index (GiST) on location columns

---

## 🔍 Search Architecture

**Typesense** provides:
- Typo-tolerant search across titles and descriptions
- Faceted filtering (category, condition, price range)
- Geo-search (filter by radius from coordinates)
- Sub-50ms response times
- Lower RAM footprint than Elasticsearch

---

## 📦 Project Structure Details

```
apps/web/src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (header, footer)
│   ├── page.tsx            # Homepage
│   ├── listing/[slug]/     # Listing detail (SSR)
│   ├── search/             # Search results (SSR)
│   ├── post/               # Post ad form
│   ├── chat/               # Messaging
│   ├── profile/[id]/       # Public profiles
│   ├── my-ads/             # Dashboard
│   ├── favorites/          # Saved listings
│   └── (auth)/login/       # Authentication
├── components/ui/          # Reusable UI components
├── lib/                    # Utilities, API client, constants
└── store/                  # Zustand state management

apps/api/src/
├── entities/               # TypeORM entities
├── modules/
│   ├── auth/               # Authentication (OTP + JWT)
│   ├── users/              # User management
│   ├── listings/           # Listing CRUD
│   ├── categories/         # Category management
│   ├── chat/               # Real-time messaging
│   ├── search/             # Typesense integration
│   ├── media/              # Image upload & processing
│   └── notifications/      # Push notifications
├── common/                 # Shared interceptors, filters, DTOs
└── database/               # Seeds & migrations
```

---

## 🛡️ Security

- **Phone OTP Authentication** — No password storage needed
- **JWT Access + Refresh Tokens** — Short-lived access, long-lived refresh
- **Rate Limiting** — NestJS Throttler on all endpoints
- **Input Validation** — class-validator on all DTOs
- **CORS** — Configured for known origins
- **Image Moderation** — AWS Rekognition for prohibited content
- **In-App Chat** — No personal phone number exposure

---

## 📄 License

MIT — Build something great! 🚀

# OLX
