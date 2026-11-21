import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Percent,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { DashboardData } from '../types/dashboard';
import { MetricCard } from '../components/common/MetricCard';
import { Badge } from '../components/common/Badge';

interface SalesPageProps {
  data: DashboardData;
}

export const SalesPage: React.FC<SalesPageProps> = ({ data }) => {
  const { sales_overview, orders, sales_trends, recent_orders, period } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'failed'>('all');

  const formatEGP = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Cairo',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return isoString;
    }
  };

  const filteredOrders = useMemo(() => {
    return recent_orders.filter((order) => {
      const matchesSearch =
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(order.order_id).includes(searchTerm);

      let matchesStatus = true;
      if (statusFilter === 'confirmed') {
        matchesStatus = order.status === 'closed' && order.result === 'successful';
      } else if (statusFilter === 'failed') {
        matchesStatus = order.status === 'closed' && order.result === 'not_successful';
      } else if (statusFilter === 'pending') {
        matchesStatus = order.status === 'open';
      }

      return matchesSearch && matchesStatus;
    });
  }, [recent_orders, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Gross Sales"
          value={formatEGP(sales_overview.subtotal)}
          subtitle="Before applied discounts"
          icon={DollarSign}
        />
        <MetricCard
          title="Net Revenue"
          value={formatEGP(sales_overview.total_sales)}
          subtitle="Confirmed collections"
          icon={ShoppingCart}
          trend={{ value: `${orders.confirmed} Orders`, isPositive: true }}
        />
        <MetricCard
          title="Discount Value"
          value={formatEGP(sales_overview.discount_value)}
          subtitle="Customer savings applied"
          icon={Percent}
        />
        <MetricCard
          title="Order Success Rate"
          value={orders.total > 0 ? `${Math.round((orders.confirmed / orders.total) * 100)}%` : '0%'}
          subtitle={`${orders.failed} failed / cancelled`}
          icon={CheckCircle}
          badgeText={`${orders.pending} Open`}
          badgeVariant="warning"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Confirmed Orders</div>
            <div className="text-xl font-bold text-slate-900">{orders.confirmed}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Pending Orders</div>
            <div className="text-xl font-bold text-slate-900">{orders.pending}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Failed / Cancelled</div>
            <div className="text-xl font-bold text-slate-900">{orders.failed}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Daily Performance Breakdown</h2>
          <p className="text-xs text-slate-500">
            Recorded between {period.from} and {period.to} ({period.timezone})
          </p>
        </div>

        <div className="h-72 w-full">
          {sales_trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales_trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${v.toLocaleString()}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    name === 'Revenue (EGP)' ? `${Number(value).toLocaleString()} EGP` : value,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: '#0c0f50',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="total_sales" name="Revenue (EGP)" fill="#bc4ea9" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="order_count" name="Order Count" fill="#ecbc8c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              No daily sales data for this range
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Orders Log</h2>
            <p className="text-xs text-slate-500">Filtered orders within selected date range</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-hidden focus:border-[#bc4ea9]"
              />
            </div>

            <div className="flex items-center space-x-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed / Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Timestamp (Cairo)</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Status & Result</th>
                <th className="py-3 px-4 text-right">Discount</th>
                <th className="py-3 px-4 text-right">Total (EGP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  let badgeVariant: 'success' | 'warning' | 'danger' = 'warning';
                  let statusText = 'Pending Confirmation';

                  if (order.status === 'closed') {
                    if (order.result === 'successful') {
                      badgeVariant = 'success';
                      statusText = 'Confirmed Sale';
                    } else {
                      badgeVariant = 'danger';
                      statusText = order.cancel_reason || 'Cancelled';
                    }
                  }

                  return (
                    <tr key={order.order_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">#{order.order_id}</td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(order.created_at)}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{order.customer_name}</td>
                      <td className="py-3 px-4">
                        <Badge variant={badgeVariant} size="sm">
                          {statusText}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500">
                        {order.discount_percent > 0 ? `${order.discount_percent}%` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatEGP(order.total)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No orders match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
