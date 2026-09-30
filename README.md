# RentAll

A full-stack  rental management platform built with the MERN stack. RentAll enables rental businesses to manage their Item inventory, process bookings, handle returns and inspections, track maintenance, and record payments : all through role-based portals for administrators, staff, and customers.

[Live Demo](https://rentall-platform.vercel.app)  
[GitHub Repository](https://github.com/aveenavin/rentAll-platform)

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)
![Brevo](https://img.shields.io/badge/Brevo-009286?logo=brevo&logoColor=white)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [User Roles](#user-roles)
- [Application Workflow](#application-workflow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Security](#security)
- [Production Deployment](#production-deployment)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)

---

## Features

- **Role-Based Access Control** : Separate portals and permissions for Admin, Staff, and Customer roles
- **Items Inventory Management** : Full CRUD with multi-image upload (up to 5 per item) via Cloudinary, categories, condition tracking, and serial numbers
- **Rental Booking System** : Date-based availability checks that prevent double-bookings, snapshot pricing at time of booking, delivery address and contact capture
- **Rental Lifecycle Management** : Status transitions: `Pending → Confirmed → Checked Out → Returned` with cancellation support
- **Return Processing** : Condition assessment, damage recording with charges, security deposit refund/deduction handling, and automatic item status updates
- **Maintenance Logging** : Create maintenance logs that lock Item to `maintenance` status, complete logs to release items back to `available`
- **Payment Tracking** : Record payments (advance, balance, damage charges, deposit refunds) by method (cash, card, bank transfer, online), with overpayment protection and per-rental payment summaries
- **Invoice Generation** : Per-rental invoices with line items, payment history, return details, and balance calculation
- **Admin Dashboard** : KPI stat cards, 12-month revenue and rental trend charts, rental status breakdown, category utilization, and recent activity feeds
- **Customer Dashboard** : Personal rental overview and item catalog browsing
- **Email Verification** : Token-based email verification via Brevo with resend support, hashed tokens stored in the database
- **Automatic Admin Seeding** : Default admin account created on first startup via environment variables
- **Demo Data Seeding** : Optional seed data for development environments

---

## Tech Stack

| Layer            | Technology                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| Frontend         | React 19 (Vite 8), Tailwind CSS v4, React Router v7, Axios                |
| UI / Animation   | Framer Motion, Headless UI, Lucide React, React Hot Toast                  |
| Forms            | React Hook Form, Zod, React DatePicker                                     |
| Charts           | Recharts                                                                   |
| Backend          | Node.js, Express.js v4                                                     |
| Database         | MongoDB (Mongoose ODM)                                                     |
| Authentication   | JWT (Access + Refresh tokens), bcryptjs                                    |
| Image Storage    | Cloudinary (via Multer + Streamifier)                                      |
| Email Service    | Brevo (transactional email API)                                            |
| Validation       | express-validator (backend), Zod (frontend)                                |
| Deployment       | Vercel (frontend), Render (backend), MongoDB Atlas (database)              |

---

## User Roles

| Role         | Capabilities                                                                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin**    | Full system access : Item CRUD, customer management (including delete), rental status transitions, return processing, maintenance logging, payment recording, dashboard analytics |
| **Staff**    | Item CRUD, customer management (no delete), rental status transitions, return processing, maintenance logging, payment recording, dashboard analytics          |
| **Customer** | Browse Item catalog, create rental bookings, cancel own pending rentals, view own rentals and payments, view own invoices                                      |

---

## Application Workflow

```
Registration → Email Verification (Brevo) → Login
    │
    ├── Customer: Browse Catalog → Create Booking → View Rental Status → View Invoice
    │
    └── Admin/Staff: Review Booking → Confirm → Check Out Item
                         → Process Return (Condition Inspection + Damage Assessment)
                             → Record Payments → Generate Invoice
                             → Create Maintenance Log (if needed)
```

---

## Project Structure

```
rentall/
├── backend/
│   ├── server.js                   # Entry point : env validation, DB connect, seeding
│   └── src/
│       ├── app.js                  # Express app setup (middleware, routes, error handler)
│       ├── config/
│       │   ├── db.js               # MongoDB connection
│       │   └── cloudinary.js       # Cloudinary SDK configuration
│       ├── controllers/            # Route handlers (thin : delegate to services)
│       ├── middleware/
│       │   ├── protect.js          # JWT authentication guard
│       │   ├── authorize.js        # Role-based authorization
│       │   ├── rateLimiter.js      # Global + auth-specific rate limiters
│       │   ├── sanitize.js         # NoSQL injection sanitization
│       │   ├── upload.js           # Multer + Cloudinary upload pipeline
│       │   └── errorHandler.js     # Centralized error handler
│       ├── models/                 # Mongoose schemas (User, Item, Rental, Return, Payment, MaintenanceLog)
│       ├── routes/                 # Express route definitions
│       ├── services/               # Business logic layer
│       ├── utils/                  # Helpers (JWT, email, invoice, seeding, etc.)
│       └── validators/             # express-validator rule sets
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js              # Vite + Tailwind + proxy + chunk splitting
│   ├── vercel.json                 # SPA rewrite rules for Vercel
│   └── src/
│       ├── App.jsx                 # Route definitions
│       ├── main.jsx                # React entry point
│       ├── index.css               # Tailwind + custom styles
│       ├── context/                # AuthContext (global auth state)
│       ├── hooks/                  # Custom hooks
│       ├── layouts/                # PublicLayout, ProtectedLayout, AdminLayout, CustomerLayout
│       ├── pages/
│       │   ├── public/             # Home, Login, Register, CheckEmail, VerifyEmail
│       │   ├── customer/           # Dashboard, ItemCatalog, MyRentals
│       │   ├── admin/              # AdminDashboard, Items, Customers, Rentals, Returns, Payments, Maintenance
│       │   └── shared/             # RentalDetail, InvoicePage, LegalPages
│       ├── components/             # Reusable UI, dashboard, item, rental, payment components
│       └── services/               # Axios API client + service modules
│
└── package.json                    # Root monorepo scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** : Atlas URI or local instance
- **Cloudinary** account (for image uploads)
- **Brevo** account (for transactional emails)

### Clone the Repository

```bash
git clone https://github.com/aveenavin/rentAll-platform
cd rentAll-platform
```

### Install All Dependencies

```bash
npm run install:all
```

Or install individually:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Configure Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your values
```

### Run the Project Locally

```bash
# Start backend (from root)
npm run dev:backend

# Start frontend (from root, in a separate terminal)
npm run dev:frontend
```

Or run from individual directories:

```bash
# Backend : runs on http://localhost:5000
cd backend && npm run dev

# Frontend : runs on http://localhost:5173
cd frontend && npm run dev
```

The Vite dev server proxies `/api` requests to the backend automatically.

---

## API Overview

Base URL: `/api/v1`

### Authentication

| Method | Endpoint                       | Access       | Description                       |
| ------ | ------------------------------ | ------------ | --------------------------------- |
| POST   | `/auth/register`               | Public       | Register a new customer account   |
| POST   | `/auth/login`                  | Public       | Login and receive JWT cookies     |
| POST   | `/auth/logout`                 | Public       | Clear authentication cookies      |
| POST   | `/auth/refresh`                | Public       | Refresh access token via cookie   |
| GET    | `/auth/me`                     | Authenticated| Get current user profile          |
| GET    | `/auth/verify/:token`          | Public       | Verify email address              |
| POST   | `/auth/resend-verification`    | Public       | Resend verification email         |

###  Items

| Method | Endpoint         | Access       | Description                        |
| ------ | ---------------- | ------------ | ---------------------------------- |
| GET    | `/items`         | Public       | List all items (with filters)      |
| GET    | `/items/:id`     | Public       | Get single item                    |
| POST   | `/items`         | Admin, Staff | Create item (with image upload)    |
| PATCH  | `/items/:id`     | Admin, Staff | Update item (with image upload)    |
| DELETE | `/items/:id`     | Admin, Staff | Delete item                        |

### Rentals

| Method | Endpoint                      | Access                  | Description                              |
| ------ | ----------------------------- | ----------------------- | ---------------------------------------- |
| GET    | `/rentals`                    | Authenticated           | List rentals (own for customer, all for admin/staff) |
| GET    | `/rentals/:id`                | Authenticated           | Get single rental                        |
| POST   | `/rentals`                    | Customer, Admin, Staff  | Create a new rental booking              |
| PATCH  | `/rentals/:id/status`         | Admin, Staff            | Update rental status                     |
| PATCH  | `/rentals/:id/cancel`         | Authenticated           | Cancel own pending rental                |
| GET    | `/rentals/availability/:itemId` | Authenticated         | Check item availability for date range   |

### Returns

| Method | Endpoint                  | Access       | Description                          |
| ------ | ------------------------- | ------------ | ------------------------------------ |
| GET    | `/returns`                | Admin, Staff | List all return records              |
| GET    | `/returns/:id`            | Admin, Staff | Get single return record             |
| GET    | `/returns/rental/:rentalId` | Admin, Staff | Get return record by rental ID     |
| POST   | `/returns`                | Admin, Staff | Process a return                     |

### Payments

| Method | Endpoint                       | Access        | Description                          |
| ------ | ------------------------------ | ------------- | ------------------------------------ |
| GET    | `/payments`                    | Authenticated | List payments (role-scoped)          |
| GET    | `/payments/:id`                | Authenticated | Get single payment                   |
| POST   | `/payments`                    | Admin, Staff  | Record a payment                     |
| GET    | `/payments/rental/:rentalId`   | Authenticated | Get payments for a rental            |
| GET    | `/payments/invoice/:rentalId`  | Authenticated | Get invoice for a rental             |

### Maintenance

| Method | Endpoint                       | Access       | Description                          |
| ------ | ------------------------------ | ------------ | ------------------------------------ |
| GET    | `/maintenance`                 | Admin, Staff | List all maintenance logs            |
| GET    | `/maintenance/:id`             | Admin, Staff | Get single maintenance log           |
| POST   | `/maintenance`                 | Admin, Staff | Create maintenance log               |
| PATCH  | `/maintenance/:id/complete`    | Admin, Staff | Complete a maintenance log           |

### Customers

| Method | Endpoint            | Access       | Description                     |
| ------ | ------------------- | ------------ | ------------------------------- |
| GET    | `/customers`        | Admin, Staff | List all customers              |
| GET    | `/customers/:id`    | Admin, Staff | Get single customer             |
| PATCH  | `/customers/:id`    | Admin, Staff | Update customer                 |
| DELETE | `/customers/:id`    | Admin        | Delete customer                 |

### Dashboard

| Method | Endpoint       | Access       | Description                    |
| ------ | -------------- | ------------ | ------------------------------ |
| GET    | `/dashboard`   | Admin, Staff | Get aggregated dashboard data  |

### Health Check

| Method | Endpoint   | Access | Description           |
| ------ | ---------- | ------ | --------------------- |
| GET    | `/health`  | Public | API health status     |

---

## Security

The following security measures are implemented in the current codebase:

- **Password Hashing** : bcryptjs with cost factor 12
- **JWT Authentication** : Dual-token strategy (short-lived access token + long-lived refresh token)
- **httpOnly Cookies** : Tokens stored in `httpOnly`, `secure`, `sameSite` cookies (never exposed to JavaScript)
- **Helmet** : Security headers with custom Content Security Policy (CSP)
- **CORS** : Origin whitelist with credentials support
- **Rate Limiting** : 200 requests / 15 min (global), 20 requests / 15 min (auth endpoints)
- **NoSQL Injection Prevention** : Custom sanitizer that strips `$` and `.` keys from request data (Express 5 compatible)
- **Input Validation** : express-validator on all mutating endpoints with Zod schemas on the frontend
- **Request Body Size Limit** : 10 KB cap on JSON and URL-encoded payloads
- **Response Compression** : gzip compression via the `compression` middleware
- **Email Verification** : SHA-256 hashed tokens with 30-minute expiry; raw tokens never stored in the database
- **Account Suspension** : Suspended users are blocked at the authentication middleware level
- **Production Env Validation** : Server exits immediately if critical environment variables are missing
- **No Source Maps in Production** : Vite build configured with `sourcemap: false`

---

## Production Deployment

### Architecture

```
┌──────────────┐     ┌───────────────┐     ┌────────────────┐
│   Vercel     │────▶│    Render     │────▶│  MongoDB Atlas │
│  (Frontend)  │     │   (Backend)   │     │   (Database)   │
└──────────────┘     └───────┬───────┘     └────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              ┌─────▼─────┐   ┌──────▼──────┐
              │ Cloudinary │   │    Brevo    │
              │  (Images)  │   │   (Email)   │
              └───────────┘   └─────────────┘
```

### Backend → Render

1. Go to **Render Dashboard → New → Web Service** → connect your repository.
2. Set **Root Directory** to `backend`, **Build Command** to `npm install`, **Start Command** to `npm start`.
3. Add all environment variables from `backend/.env.production.example`.
4. Key variables to set:
   - `NODE_ENV=production`
   - `MONGO_URI` : your MongoDB Atlas connection string
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` : unique random secrets
   - `CLIENT_URL` : your deployed Vercel frontend URL
   - `COOKIE_SAME_SITE=none` : required for cross-domain cookies
   - `CLOUDINARY_*` : your Cloudinary credentials
   - `BREVO_*` : your Brevo API key and sender details
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` : initial admin credentials

### Frontend → Vercel

1. Go to **Vercel Dashboard → New Project** → import your repository.
2. Set **Root Directory** to `frontend`.
3. Set the environment variable:
   - `VITE_API_BASE_URL` = `https://your-backend.onrender.com/api/v1`

The `vercel.json` in the frontend directory handles SPA routing rewrites.

### Post-Deploy Verification

| Check              | How                                                                         |
| ------------------ | --------------------------------------------------------------------------- |
| Backend alive      | `GET https://your-backend.onrender.com/health` → `{"status":"ok"}`          |
| Database connected | Server logs show `MongoDB connected: ...`                                   |
| Auth flow works    | Register → verify email → login → check cookies in DevTools                |
| Image uploads      | Create an item with images → verify Cloudinary URLs load                    |
| No source maps     | DevTools → Sources → no `.jsx` files visible                                |
| Error handling     | Hit a bad route → response is `{"status":"error","message":"..."}` (no stack trace) |

---


## Live Demo

- **Live Demo:** [Try RentAll](https://rentall-platform.vercel.app)

---

## Screenshots

### Landing Page

 Overview with responsive UI.

![ Landing Page](screenshots/IMG_20260808_203159.jpg)


### Dashboards
Customer Dashboard &  Admin Dashboard comprehensive overview with responsive UI.

![ Dashboard](screenshots/IMG_20260808_203052.jpg)


### Customer Catalog & Booking Interface
**Customer Item Catalog**  

![Item Catalog](screenshots/IMG_20260808_222820.jpg)

**Customer Booking**  

![Item Booking](screenshots/IMG_20260808_222853.jpg)

**Customer Booking Details**  

![Item Details](screenshots/IMG_20260808_223000.jpg)

**Invoice**  

![Item Invoice](screenshots/IMG_20260808_224213.png)

### Admin 
**Admin Item Catalog**  

Manage retal items and view their complete details.
![Item Catalog](screenshots/IMG_20260809_162035.jpg)

### Rental Management Workflow
**Rentals Overview**  
Centralized management of all rental requests and their current statuses.

![Admin Rentals Management](screenshots/IMG_20260809_162058.jpg)

**Returns Details & Processing Returns Timeline**  
Detailed view of a Returns's history and status progression.

![Returns Details](screenshots/IMG_20260809_162122.jpg)

**Add & Maintenance Items**  
 maintenance activities to keep track of item health and manage inventory details and images.

![Add Item Modal & Maintenance Log](screenshots/IMG_20260809_162209.jpg)

**Financials**  
Record payments and generate printable, itemized invoices.

![Invoice Generation](screenshots/IMG_20260809_162238.jpg)

### User Management
**Customer Directory & Profiles**  
Manage customer accounts, view their histories, and handle account suspensions.

![Customer Management](screenshots/IMG_20260809_162309.jpg)



---

## Future Improvements

- Password reset / forgot password flow
- User profile editing and avatar upload
- Email notifications for rental status changes
- Item search with advanced filters (price range, availability dates)
- Online payment gateway integration (e.g., Razorpay or Stripe)
- Pagination and sorting on all list views
- Reporting and export (CSV/PDF) for financial data
- Automated overdue rental reminders
- Multi-tenant support for managing multiple rental businesses

---

*Built as a portfolio project demonstrating MERN stack engineering practices.*
