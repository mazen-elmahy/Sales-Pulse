import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import type { ProductItem } from '../types/dashboard';
import { Badge } from '../components/common/Badge';

interface InventoryPageProps {
  products: ProductItem[];
  lowStockThreshold?: number;
}

type SortField = 'id' | 'name' | 'category' | 'price' | 'stock_qty';
type SortOrder = 'asc' | 'desc';
type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';

export const InventoryPage: React.FC<InventoryPageProps> = ({
  products,
  lowStockThreshold = 5,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(p.id).includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

        let matchesStock = true;
        if (stockFilter === 'in_stock') {
          matchesStock = p.is_available && p.stock_qty > lowStockThreshold;
        } else if (stockFilter === 'low_stock') {
          matchesStock = p.is_available && p.stock_qty > 0 && p.stock_qty <= lowStockThreshold;
        } else if (stockFilter === 'out_of_stock') {
          matchesStock = !p.is_available || p.stock_qty === 0;
        }

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }

        return sortOrder === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      });
  }, [products, searchTerm, selectedCategory, stockFilter, sortField, sortOrder, lowStockThreshold]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 ml-1 inline" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#bc4ea9] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#bc4ea9] ml-1 inline" />
    );
  };

  const formatEGP = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-3.5 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-[#9e5a95]" />
          <span>
            <strong>Read-Only Access:</strong> Stock adjustments & inventory updates must be performed via Supabase or n8n workflow triggers.
          </span>
        </div>
        <span className="font-semibold text-slate-700">
          Total Catalog: {products.length} Items
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, ID, or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-hidden focus:border-[#bc4ea9] focus:ring-1 focus:ring-[#bc4ea9]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-700 focus:outline-hidden focus:border-[#bc4ea9]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value as StockFilter);
                setCurrentPage(1);
              }}
              className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-700 focus:outline-hidden focus:border-[#bc4ea9]"
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">In Stock (&gt; {lowStockThreshold})</option>
              <option value="low_stock">Low Stock (&le; {lowStockThreshold})</option>
              <option value="out_of_stock">Out of Stock (0 units)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors w-16"
                >
                  ID {getSortIcon('id')}
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  Product Name {getSortIcon('name')}
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  Category {getSortIcon('category')}
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  Unit Price {getSortIcon('price')}
                </th>
                <th
                  onClick={() => handleSort('stock_qty')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  Current Stock {getSortIcon('stock_qty')}
                </th>
                <th className="py-3 px-4 text-center">Availability</th>
                <th className="py-3 px-4 text-right">Inventory Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const isLow = p.is_available && p.stock_qty > 0 && p.stock_qty <= lowStockThreshold;
                  const isOut = !p.is_available || p.stock_qty === 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-mono">#{p.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{p.name}</td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900">
                        {formatEGP(p.price)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold">
                        <div className="flex items-center justify-end space-x-2">
                          <span
                            className={
                              isOut
                                ? 'text-rose-600 font-bold'
                                : isLow
                                ? 'text-amber-600 font-bold'
                                : 'text-slate-800'
                            }
                          >
                            {p.stock_qty}
                          </span>
                          {isOut ? (
                            <span title="Out of stock">
                              <XCircle className="w-4 h-4 text-rose-500" />
                            </span>
                          ) : isLow ? (
                            <span title="Low stock warning">
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            </span>
                          ) : (
                            <span title="Healthy stock">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={p.is_available ? 'success' : 'danger'} size="sm">
                          {p.is_available ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-600">
                        {formatEGP(p.price * p.stock_qty)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No products found matching the search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Showing <strong className="text-slate-700">{filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-700">{Math.min(currentPage * pageSize, filteredProducts.length)}</strong> of{' '}
            <strong className="text-slate-700">{filteredProducts.length}</strong> items
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-slate-600">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded-md px-2 py-1 bg-white text-xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <span className="px-2 font-medium text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
