import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Boxes,
  AlertTriangle,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import type { DashboardData } from '../types/dashboard';
import { MetricCard } from '../components/common/MetricCard';

interface OverviewPageProps {
  data: DashboardData;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ data }) => {
  const {
    sales_overview,
    orders,
    sales_trends,
    top_products,
    recent_orders,
    inventory_summary,
    category_distribution,
  } = data;

  const formatEGP = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const categoryColors = ['#bc4ea9', '#9e5a95', '#ecbc8c', '#29244f'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Revenue"
          value={formatEGP(sales_overview.total_sales)}
          subtitle={`From ${orders.confirmed} confirmed sales`}
          icon={DollarSign}
          trend={{ value: 'Active Range', isPositive: true }}
        />
        <MetricCard
          title="Confirmed Orders"
          value={orders.confirmed}
          subtitle={`Out of ${orders.total} total orders`}
          icon={ShoppingCart}
          badgeText={`${orders.pending} Pending`}
          badgeVariant="warning"
        />
        <MetricCard
          title="Avg Order Value"
          value={formatEGP(sales_overview.average_order_value)}
          subtitle={`Discounts given: ${formatEGP(sales_overview.discount_value)}`}
          icon={TrendingUp}
        />
        <MetricCard
          title="Total Inventory Units"
          value={inventory_summary.total_inventory_units.toLocaleString()}
          subtitle={`Across ${inventory_summary.total_products} catalog items`}
          icon={Boxes}
          badgeText={`${inventory_summary.available_products} Available`}
          badgeVariant="success"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Inventory Health Overview</h2>
            <p className="text-xs text-slate-500">Live warehouse stock and availability levels</p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Low Stock Threshold: <strong className="text-slate-800">&le; {inventory_summary.low_stock_threshold} units</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-900">In Stock (Healthy)</div>
                <div className="text-xl font-bold text-emerald-700">{inventory_summary.in_stock_products} Products</div>
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-600">&gt; 5 units</span>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-900">Low Stock Alert</div>
                <div className="text-xl font-bold text-amber-700">{inventory_summary.low_stock_products} Products</div>
              </div>
            </div>
            <span className="text-xs font-medium text-amber-600">&le; 5 units</span>
          </div>

          <div className="p-4 rounded-lg bg-rose-50/60 border border-rose-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-rose-900">Out of Stock</div>
                <div className="text-xl font-bold text-rose-700">{inventory_summary.out_of_stock_products} Products</div>
              </div>
            </div>
            <span className="text-xs font-medium text-rose-600">0 units</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Sales Trends (EGP)</h2>
              <p className="text-xs text-slate-500">Daily confirmed order revenue over selected range</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {sales_trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sales_trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#bc4ea9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#bc4ea9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${v.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString()} EGP`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: '#0c0f50',
                      borderColor: '#29244f',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total_sales"
                    stroke="#bc4ea9"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No sales data recorded for the selected period
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Stock by Category</h2>
            <p className="text-xs text-slate-500">Total units per product category</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={category_distribution} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="category"
                  type="category"
                  tick={{ fontSize: 11, fill: '#334155' }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  formatter={(val: any, _: any, item: any) => [
                    `${val} units (${item.payload.product_count} products)`,
                    'Inventory',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0c0f50',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="total_units" radius={[0, 4, 4, 0]}>
                  {category_distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Top Selling Products</h2>
            <span className="text-xs text-slate-500">By units sold</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2 text-right">Units Sold</th>
                  <th className="pb-2 text-right">Gross Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {top_products.map((p) => (
                  <tr key={p.product_id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 font-medium text-slate-800">{p.product_name}</td>
                    <td className="py-2.5 text-slate-500">{p.category || 'General'}</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">{p.units_sold}</td>
                    <td className="py-2.5 text-right font-medium text-[#bc4ea9]">{formatEGP(p.gross_value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Activity</h2>
            <span className="text-xs text-slate-500">Latest transactions</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-2">Order #</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent_orders.slice(0, 5).map((order) => {
                  let statusBg = 'bg-amber-100 text-amber-700 border-amber-200';
                  let statusLabel = 'Pending';

                  if (order.status === 'closed') {
                    if (order.result === 'successful') {
                      statusBg = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                      statusLabel = 'Confirmed';
                    } else {
                      statusBg = 'bg-rose-100 text-rose-700 border-rose-200';
                      statusLabel = 'Cancelled';
                    }
                  }

                  return (
                    <tr key={order.order_id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 font-semibold text-slate-900">#{order.order_id}</td>
                      <td className="py-2.5 text-slate-600 truncate max-w-[120px]">{order.customer_name}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusBg}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-semibold text-slate-900">{formatEGP(order.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
