# Mohor — Full-Stack E-Commerce Platform

**Mohor** is a modern, high-performance full-stack e-commerce marketplace. The system is designed with a **decoupled architecture**, splitting the user experience completely from the backend data engine to ensure speed, isolation, and security.

---

## 🎯 Project Core Objectives

* **Decoupled Architecture:** A completely standalone user interface interacting with a secure, centralized API backend.
* **Dual-Zone Frontend:** Completely isolated web environments for regular customers browsing the store and administrators managing operations.
* **Performance-First Database:** Built entirely with raw, optimized SQL queries without the overhead of heavy ORMs.
* **Secure Unique Identification:** Every user, product, and order uses cryptographically secure **UUIDv4** instead of predictable auto-incrementing integers.

---

## 🛠️ The Tech Stack & Tools

### Frontend (Client Portal)
* **Next.js (App Router):** Powers the modular page routing framework.
* **Tailwind CSS:** Handles clean, responsive, utility-first UI styling.
* **Firebase Web SDK:** Drives the cellular network interactions to authenticate users via SMS text.

### Backend (Core API Engine)
* **Node.js & Express:** Configured using a **Module-Based Architecture** (features grouped cleanly by context like Auth, Products, and Orders).
* **Firebase Admin SDK:** Validates incoming frontend security tokens directly against security servers.
* **Multer & Cloudinary SDK:** Intercepts product asset uploads and balances them directly into cloud media buckets.

### Database (Data Layer)
* **MySQL (`mysql2/promise`):** The primary relational database engine.
* **Connection Pooling:** Handles asynchronous database operations and queries cleanly with `async/await`.

---

## 📂 System Directory Layout

```text
mohor/
├── backend/                  # Node.js + Express Core API
│   └── src/
│       ├── config/           # Infrastructure Hookups (DB, Cloudinary, Firebase)
│       └── modules/          # Feature Modules (Auth, Products, Orders)
│
└── frontend/                 # Next.js Client Terminal
    └── src/app/
        ├── (customer)/       # Public digital storefront experience
        └── (admin)/          # Protected administrative control panel



🚀 Local Quickstart

1. Provision Environment Configurations
Create a .env file inside your /backend directory and insert your respective infrastructure connection strings:

- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (Set database according to Schema)

- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

- FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

2. Run the Cluster
Open two separate terminal screens to start both environments simultaneously:

To boot the Backend Engine:

-cd backend
-npm install
-npm run dev

To boot the Frontend Storefront:

-cd frontend
-npm install
-npm run dev