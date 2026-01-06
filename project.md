# Project Analysis: SAE_Project_BUT2-1

This document provides a comprehensive analysis of the project context, technical details, and functionality, organized by the core services of the application.

## 1. Technical Overview

### Architecture
- **Type:** Monorepo (Nx)
- **Frontend:** Vue.js 3, TypeScript, Vite, Pinia, TailwindCSS (v4)
- **Backend:** Node.js, Express, TypeScript, Prisma (MySQL/PostgreSQL)
- **API Documentation:** Swagger UI

## 2. Core Services

The application functionality is divided into distinct domains, mirroring the backend service architecture.

### 🛡️ Quests Service
**Backend:** `questService.ts`, `userQuests.ts` (seeds)
**Frontend:** `/my-quests`, `/admin/quests`, `/prestataire/quests`
- **Functionality:**
    - Users can accept and participate in quests.
    - Quests have progress tracking and completion states.
    - **Gamification:** Quests likely reward XP, items, or currency (XP mentioned in seeds/types).
    - **Administration:** Admins and Prestataires (Providers) can create and manage quests to engage users at specific locations or for specific products.

### 📍 Events & Locations Service
**Backend:** `eventService.ts`, `locations.ts` (seeds)
**Frontend:** `/map`, `/events`, `/location/:id/events`, `/admin/locations`
- **Locations:** Physical places on the map (using Leaflet). Can be shops, landmarks, or event venues.
- **Events:** Time-sensitive happenings occurring at specific locations.
- **Reservations:** Users can book spots at events (`/my-reservations`).
- **Discovery:** The interactive map is the primary way for users to find events and locations.

### 🛍️ Shop & Orders Service
**Backend:** `productService.ts`, `orderService.ts`, `cart.ts` (store)
**Frontend:** `/boutique`, `/panier`, `/checkout`, `/commandes`, `/prestataire/products`
- **Products:** Items available for purchase. Can be physical goods or tickets/services.
- **Cart & Checkout:** Standard e-commerce flow for aggregating items and processing purchases.
- **Orders:** users can view their purchase history.
- **Management:** Prestataires manage their own inventory; Admins have global oversight.
- **Statistics:** Analytics available for shop performance (`/admin/shop/stats`).

### 📰 Blog Service
**Backend:** `blogService.ts`
**Frontend:** (Likely embedded in Home or specific content pages)
- **Content:** News, updates, or lore-related articles to deepen the immersive "Kingdom" theme.
- **Rich Text:** Uses Tiptap for content creation.

### 🎫 QR Code Service
**Backend:** `qrcodeService.ts`
**Frontend:** `/qr/generate`, `/qr/scan`, `/prestataire/orders/scan`
- **Generation:** Users generate unique QR codes, likely to prove identity or claim orders.
- **Scanning:** Service providers scan user QR codes to validate orders or event entry.
- **Integration:** Bridges the digital app with physical interactions (pickups, check-ins).

### 👥 Users & Authentication Service
**Backend:** `userService.ts`, `authService.ts`
**Frontend:** `/login`, `/register`, `/profile`, `/admin/users`
- **Roles:**
    1.  **Client:** Standard user.
    2.  **Prestataire:** Business/Partner user.
    3.  **Admin:** System administrator.
- **Security:** JWT-based authentication with Bcrypt hashing.
- **Profile:** User settings and personal data management.

## 3. Site Structure (Frontend)

### Public
- **Landing:** `HomeView` (Hero, Features, Intro)
- **Map:** `MapView` (Full screen exploration)
- **Auth:** `LoginView`, `RegisterView`

### Client (User)
- **Account:** Profile, Reservations, Orders, My Quests
- **Shop:** Boutique, Cart, Checkout
- **Tools:** QR Gen

### Service Provider (Prestataire)
- **Dashboard:** `PrestataireView`
- **Management:** Products, Locations, Quests, Event Logic
- **Tools:** QR Scan

### Admin
- **Dashboard:** `AdminView`
- **Global Management:** Users, Products, Quests, Locations
- **Analytics:** Quest Stats, Shop Stats

## 4. Development & Deployment
- **Mock Mode:** `npm run frontend:dev:mock` runs the frontend without a backend.
- **Database:** Docker Compose available for local MySQL.
- **i18n:** Localization support via `locales/`.
