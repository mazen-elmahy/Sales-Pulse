export interface SalesOverview {
  total_sales: number;
  subtotal: number;
  discount_value: number;
  average_order_value: number;
}

export interface OrderCounts {
  total: number;
  confirmed: number;
  failed: number;
  pending: number;
}

export interface DailySalesTrend {
  date: string;
  order_count: number;
  total_sales: number;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  category?: string;
  units_sold: number;
  gross_value: number;
}

export interface RecentOrder {
  order_id: number;
  status: 'open' | 'closed' | string;
  result: 'successful' | 'not_successful' | null | string;
  cancel_reason?: string | null;
  total: number;
  discount_percent: number;
  created_at: string;
  customer_id: number | null;
  customer_name: string;
}

export interface InventorySummary {
  total_products: number;
  available_products: number;
  in_stock_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  total_inventory_units: number;
  low_stock_threshold: number;
}

export interface CategoryDistribution {
  category: string;
  product_count: number;
  total_units: number;
  available_count: number;
}

export interface CustomerMetrics {
  total: number;
  vip: number;
  returning: number;
}

export interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_qty: number;
  is_available: boolean;
  created_at?: string;
}

export interface DashboardData {
  period: {
    from: string;
    to: string;
    timezone: string;
  };
  sales_overview: SalesOverview;
  orders: OrderCounts;
  sales_trends: DailySalesTrend[];
  top_products: TopProduct[];
  recent_orders: RecentOrder[];
  inventory_summary: InventorySummary;
  category_distribution: CategoryDistribution[];
  customers: CustomerMetrics;
  inventory_products: ProductItem[];
}

export interface FilterParams {
  from: string;
  to: string;
  top_limit?: number;
  recent_limit?: number;
  low_stock_threshold?: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  is_demo?: boolean;
}
