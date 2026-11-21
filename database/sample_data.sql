-- ==============================================================================
-- SalesPulse: Realistic Sample Seed Data (English & EGP Currency)
-- ==============================================================================

-- 1. Insert Products with min_price
INSERT INTO public.products (name, category, price, min_price, stock_qty, is_available, description) VALUES
    ('Pulse SoundPro Wireless ANC', 'Audio', 1850.00, 1650.00, 24, true, 'Premium noise-cancelling over-ear wireless headphones with 40h battery'),
    ('EchoPods True Wireless Earbuds', 'Audio', 750.00, 680.00, 4, true, 'Compact earbuds with low latency and punchy bass (Low Stock)'),
    ('BassMax Bluetooth Speaker', 'Audio', 1200.00, 1050.00, 15, true, 'Waterproof rugged outdoor portable speaker with 20W sound'),
    ('PulseFit Chrono Smartwatch', 'Wearables', 2400.00, 2150.00, 18, true, 'Full AMOLED display, heart rate monitor, SPO2, and GPS tracking'),
    ('BandPulse Activity Tracker', 'Wearables', 650.00, 580.00, 2, true, 'Lightweight waterproof fitness band with sleep tracking (Low Stock)'),
    ('Titan PowerBank 20000mAh', 'Accessories', 890.00, 790.00, 35, true, 'Fast 65W PD charging dual port external portable battery pack'),
    ('UltraFast GaN 65W Charger', 'Accessories', 520.00, 450.00, 0, false, 'Triple port fast charging GaN compact wall plug (Out of Stock)'),
    ('Braided USB-C to C 100W Cable', 'Accessories', 190.00, 160.00, 50, true, '2-meter heavy-duty nylon braided fast charging cable'),
    ('MagPulse Magnetic Car Mount', 'Accessories', 380.00, 320.00, 3, true, 'Fast wireless charging vehicle dashboard phone mount (Low Stock)'),
    ('SmartGlow RGB Smart Bulb', 'Smart Home', 310.00, 260.00, 22, true, 'Wi-Fi enabled color-changing smart LED bulb compatible with Alexa'),
    ('Aura Ambient Light Strip 5M', 'Smart Home', 580.00, 490.00, 12, true, 'Music-syncing RGB smart home lighting strip for bedrooms and desks'),
    ('SmartPlug Energy Monitor', 'Smart Home', 420.00, 350.00, 0, false, 'Real-time wattage tracking Wi-Fi smart wall plug (Out of Stock)')
ON CONFLICT DO NOTHING;

-- 2. Insert Customers with English names
INSERT INTO public.customers (telegram_id, name, username, phone, is_vip, created_at) VALUES
    (101928374, 'Ahmed Hassan', 'ahmed_h', '+201012345678', true, NOW() - INTERVAL '40 days'),
    (204829102, 'Sara Mansour', 'saram', '+201123456789', false, NOW() - INTERVAL '28 days'),
    (309182746, 'Omar Khaled', 'omar_k', '+201234567890', false, NOW() - INTERVAL '18 days'),
    (401827364, 'Yasmine Tarek', 'yasmine_t', '+201545678901', true, NOW() - INTERVAL '12 days'),
    (508273918, 'Kareem Fahmy', 'kareemf', '+201098765432', false, NOW() - INTERVAL '4 days')
ON CONFLICT (telegram_id) DO NOTHING;

-- 3. Insert Orders & Order Items across last 30 days
DO $$
DECLARE
    c1 INT; c2 INT; c3 INT; c4 INT; c5 INT;
    p1 INT; p2 INT; p3 INT; p4 INT; p5 INT; p6 INT;
    o_id INT;
BEGIN
    SELECT id INTO c1 FROM public.customers WHERE telegram_id = 101928374 LIMIT 1;
    SELECT id INTO c2 FROM public.customers WHERE telegram_id = 204829102 LIMIT 1;
    SELECT id INTO c3 FROM public.customers WHERE telegram_id = 309182746 LIMIT 1;
    SELECT id INTO c4 FROM public.customers WHERE telegram_id = 401827364 LIMIT 1;
    SELECT id INTO c5 FROM public.customers WHERE telegram_id = 508273918 LIMIT 1;

    SELECT id INTO p1 FROM public.products WHERE name LIKE 'Pulse SoundPro%' LIMIT 1;
    SELECT id INTO p2 FROM public.products WHERE name LIKE 'EchoPods%' LIMIT 1;
    SELECT id INTO p3 FROM public.products WHERE name LIKE 'PulseFit Chrono%' LIMIT 1;
    SELECT id INTO p4 FROM public.products WHERE name LIKE 'Titan PowerBank%' LIMIT 1;
    SELECT id INTO p5 FROM public.products WHERE name LIKE 'Braided USB-C%' LIMIT 1;
    SELECT id INTO p6 FROM public.products WHERE name LIKE 'SmartGlow%' LIMIT 1;

    -- Order 1: 24 days ago (Confirmed)
    INSERT INTO public.orders (customer_id, status, result, total, discount_percent, created_at)
    VALUES (c1, 'closed', 'successful', 1850.00, 0, NOW() - INTERVAL '24 days') RETURNING id INTO o_id;
    INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
    VALUES (o_id, p1, 1, 1850.00);

    -- Order 2: 20 days ago (Confirmed, Large order discount 5%)
    INSERT INTO public.orders (customer_id, status, result, total, discount_percent, created_at)
    VALUES (c2, 'closed', 'successful', 2280.00, 5.0, NOW() - INTERVAL '20 days') RETURNING id INTO o_id;
    INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
    VALUES (o_id, p3, 1, 2400.00);

    -- Order 3: 15 days ago (Confirmed, 2 products)
    INSERT INTO public.orders (customer_id, status, result, total, discount_percent, created_at)
    VALUES (c3, 'closed', 'successful', 1080.00, 0, NOW() - INTERVAL '15 days') RETURNING id INTO o_id;
    INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
    VALUES (o_id, p4, 1, 890.00), (o_id, p5, 1, 190.00);

    -- Order 4: 10 days ago (Cancelled during confirmation)
    INSERT INTO public.orders (customer_id, status, result, cancel_reason, total, discount_percent, created_at)
    VALUES (c4, 'closed', 'not_successful', 'Customer cancelled order during confirmation', 750.00, 0, NOW() - INTERVAL '10 days') RETURNING id INTO o_id;
    INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
    VALUES (o_id, p2, 1, 750.00);

    -- Order 5: 6 days ago (Confirmed, VIP discount 3%)
    INSERT INTO public.orders (customer_id, status, result, total, discount_percent, created_at)
    VALUES (c1, 'closed', 'successful', 1794.50, 3.0, NOW() - INTERVAL '6 days') RETURNING id INTO o_id;
    INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
    VALUES (o_id, p1, 1, 1850.00);

    -- Order 6: 2 days ago (Confirmed)
    INSERT INTO public.orders (customer_id, status, result, total, discount_percent, created_at)
    VALUES (c5, 'closed', 'successful', 930.00, 0, NOW() - INTERVAL '2 days') RETURNING id INTO o_id;
    INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
    VALUES (o_id, p6, 3, 310.00);

    -- Order 7: Today (Open / Pending confirmation)
    INSERT INTO public.orders (customer_id, status, result, total, discount_percent, created_at)
    VALUES (c2, 'open', NULL, 890.00, 0, NOW()) RETURNING id INTO o_id;
    INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
    VALUES (o_id, p4, 1, 890.00);
END $$;
