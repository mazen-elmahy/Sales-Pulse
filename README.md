# SalesPulse (Sales-Pulse)

SalesPulse is an end-to-end e-commerce automation and analytics platform powered by **n8n workflows**, **Supabase (PostgreSQL)**, a customer-facing **Telegram Bot**, and a modern, read-only **Admin Web Dashboard**.

---

## 🏗️ System Architecture

```
[ Telegram Users ] <---> [ n8n Workflow 1 & 2 ] <---> [ Supabase DB ]
                                                             ^
                                                             |
[ Admin Dashboard ] <---> [ n8n Workflow 3 (Metrics) ] -------+
```

1. **Customer Ordering (Telegram)**: Sole interface for customer interactions (browsing catalog, placing orders, order status tracking).
2. **Database (Supabase PostgreSQL)**: Central datastore for products, inventory, customers, order items, and customer interest logs.
3. **Backend Workflows (n8n)**:
   - `WF1- Telegram_Bot.json`: Customer bot UI and navigation.
   - `WF2-Process_and_Save_order.json`: Transactional order processing and stock deduction.
   - `WF3-Dashboard.json`: Secure, read-only analytics API endpoint (`POST /webhook/dashboard-metrics`).
   - `WF4-Error_Handling.json`: Centralized logging and error notification.
   - `WF5-Report_File.json`: Periodic reporting.
4. **Admin Web Dashboard (`frontend/`)**: High-performance React 19 + TypeScript + Vite + Tailwind CSS admin portal for store owners. Securely queries n8n webhooks without exposing database credentials to the browser.

---

## 📁 Repository Structure

```
.
├── database/
│   ├── schema.sql           # Complete Supabase DDL (tables, views, indexes, RLS)
│   └── sample_data.sql      # English seed data (products, customers, orders, interests)
├── workflows/
│   ├── WF1- Telegram_Bot.json
│   ├── WF2-Process_and_Save_order.json
│   ├── WF3-Dashboard.json   # Enhanced metrics calculation workflow
│   ├── WF4-Error_Handling.json
│   └── WF5-Report_File.json
├── frontend/                # Admin Web Dashboard (React 19 + TypeScript + Vite)
│   ├── src/
│   │   ├── components/      # UI components (KPI cards, charts, inventory, orders)
│   │   ├── services/        # n8n API client & mock data fallback
│   │   ├── types/           # TypeScript definitions
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── .env.example
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Database Setup (Supabase)
1. Go to your [Supabase SQL Editor](https://app.supabase.com).
2. Run `database/schema.sql` to initialize tables (`products`, `customers`, `orders`, `order_items`, `customer_interests`) and the `product_categories` view.
3. Run `database/sample_data.sql` to populate sample English products, orders, and customer data.

### 2. n8n Workflows Setup
1. In your n8n instance, import the JSON files from `workflows/`.
2. Connect your Supabase PostgreSQL credentials to the Postgres nodes.
3. Activate `WF3-Dashboard.json` (`POST /webhook/dashboard-metrics`).

### 3. Frontend Dashboard Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env to set your VITE_N8N_WEBHOOK_URL
npm run dev
```

For production builds:
```bash
npm run build
npm run preview
```

---

## 🔒 Security Principles
- **Admin-Only Read-Only Access**: Dashboard does not contain write actions or sensitive order manipulation.
- **Credential Isolation**: The browser only communicates with n8n via API token; Supabase `service_role` credentials are kept strictly on the backend.
