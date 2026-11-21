import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import type { ActiveTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewPage } from './pages/OverviewPage';
import { InventoryPage } from './pages/InventoryPage';
import { SalesPage } from './pages/SalesPage';
import { LoginPage } from './pages/LoginPage';
import type { DashboardData, FilterParams } from './types/dashboard';
import { fetchDashboardMetrics } from './services/api';
import { Loader2, AlertCircle } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { user, token, isDemo, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [data, setData] = useState<DashboardData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [isMockData, setIsMockData] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterParams>(() => {
    const today = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
    return {
      from,
      to: today,
      top_limit: 5,
      recent_limit: 20,
      low_stock_threshold: 5,
    };
  });

  const loadData = useCallback(async () => {
    setIsDataLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetchDashboardMetrics(token, filters, isDemo);
      setData(res.data);
      setIsMockData(res.isMock);
      if (res.error) {
        console.info('[SalesPulse] Network info:', res.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setErrorMessage(msg);
    } finally {
      setIsDataLoading(false);
    }
  }, [token, filters, isDemo]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#bc4ea9]" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const getPageMeta = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: 'Store Performance Overview',
          subtitle: `Aggregated sales and inventory metrics from ${filters.from} to ${filters.to} (Africa/Cairo)`,
        };
      case 'inventory':
        return {
          title: 'Inventory Monitoring',
          subtitle: 'Searchable, filterable real-time stock levels with low-stock alerts',
        };
      case 'sales':
        return {
          title: 'Sales & Activity Analytics',
          subtitle: 'Orders breakdown, transaction history, and revenue trends',
        };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isMock={isMockData} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={title}
          subtitle={subtitle}
          filters={filters}
          onFilterChange={setFilters}
          onRefresh={loadData}
          isLoading={isDataLoading}
          isMock={isMockData}
        />

        <main className="flex-1 overflow-y-auto p-8">
          {errorMessage ? (
            <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">Failed to load data</h3>
                <p className="text-xs mt-1">{errorMessage}</p>
                <button
                  onClick={loadData}
                  className="mt-3 px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-md hover:bg-rose-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : isDataLoading && !data ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#bc4ea9]" />
              <p className="text-xs font-medium">Fetching store metrics via n8n backend...</p>
            </div>
          ) : data ? (
            <>
              {activeTab === 'overview' && <OverviewPage data={data} />}
              {activeTab === 'inventory' && (
                <InventoryPage
                  products={data.inventory_products}
                  lowStockThreshold={data.inventory_summary.low_stock_threshold}
                />
              )}
              {activeTab === 'sales' && <SalesPage data={data} />}
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
};

export default App;
