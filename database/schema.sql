-- ==============================================================================
-- SalesPulse: Supabase PostgreSQL Schema & Security Policies
-- ==============================================================================

-- 1. Core Tables

-- Products
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    min_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (min_price >= 0),
    stock_qty INT NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    is_available BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE IF NOT EXISTS public.customers (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE,
    name TEXT,
    username TEXT,
    phone TEXT,
    is_vip BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES public.customers(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'open',          -- 'open', 'closed'
    result TEXT DEFAULT NULL,                     -- 'successful', 'not_successful'
    cancel_reason TEXT DEFAULT NULL,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    discount_percent NUMERIC(5, 2) DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Interests (Funnel tracking for bot interactions)
CREATE TABLE IF NOT EXISTS public.customer_interests (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES public.customers(id) ON DELETE CASCADE,
    product_id INT REFERENCES public.products(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL DEFAULT 'view',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES public.customers(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    priority TEXT NOT NULL DEFAULT 'normal',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ DEFAULT NULL
);

-- Error Log (WF4)
CREATE TABLE IF NOT EXISTS public.error_log (
    id SERIAL PRIMARY KEY,
    worlflow_name TEXT,
    excution_id TEXT,
    excution_url TEXT,
    node_name TEXT,
    error_message TEXT,
    occured_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row Level Security (RLS) Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_interests ENABLE ROW LEVEL SECURITY;

-- Allow public catalog browsing (for Telegram bot and visitors)
DROP POLICY IF EXISTS "Public read access for products" ON public.products;
CREATE POLICY "Public read access for products" ON public.products
    FOR SELECT TO anon, authenticated
    USING (true);

-- Restrict orders, items, and customers to authorized administrators
DROP POLICY IF EXISTS "Admin read access for orders" ON public.orders;
CREATE POLICY "Admin read access for orders" ON public.orders
    FOR SELECT TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'salespulse_role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'salespulse_role') = 'admin'
    );

DROP POLICY IF EXISTS "Admin read access for order_items" ON public.order_items;
CREATE POLICY "Admin read access for order_items" ON public.order_items
    FOR SELECT TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'salespulse_role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'salespulse_role') = 'admin'
    );

DROP POLICY IF EXISTS "Admin read access for customers" ON public.customers;
CREATE POLICY "Admin read access for customers" ON public.customers
    FOR SELECT TO authenticated
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'salespulse_role') = 'admin'
        OR (auth.jwt() -> 'user_metadata' ->> 'salespulse_role') = 'admin'
    );

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_orders_created_status_result ON public.orders(created_at, status, result);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock_qty, is_available);
