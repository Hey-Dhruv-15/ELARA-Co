import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminService } from '../../services/adminService';
import { DashboardMetrics } from '../../types';
import { formatINR } from '../../utils/formatters';
import {
  Package,
  Layers,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  Plus,
  Sparkles,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await AdminService.getDashboard();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#8A4A52] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900/40';
      case 'Confirmed':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-900/40';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-900/40';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/40';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-elara-border-light dark:border-elara-border-dark">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-elara-accent-light dark:text-elara-accent-dark">
            Executive Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light mt-0.5">
            Boutique Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#723c43] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/homepage"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-elara-border-light dark:border-elara-border-dark text-xs font-semibold uppercase tracking-wider hover:bg-[#F7E9E7] dark:hover:bg-[#302729] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-elara-accent-light" />
            <span>Edit Homepage</span>
          </Link>
        </div>
      </div>

      {/* 2. Core Operational Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white dark:bg-[#252021] p-5 rounded-2xl border border-elara-border-light dark:border-elara-border-dark shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark">
              Products
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52] dark:text-elara-accent-dark">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-elara-text-dark dark:text-elara-text-light">
              {metrics?.totalProducts || 0}
            </span>
            <span className="text-[11px] text-elara-text-muted block mt-1">Live in catalogue</span>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-[#252021] p-5 rounded-2xl border border-elara-border-light dark:border-elara-border-dark shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark">
              Categories
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52] dark:text-elara-accent-dark">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-elara-text-dark dark:text-elara-text-light">
              {metrics?.totalCategories || 0}
            </span>
            <span className="text-[11px] text-elara-text-muted block mt-1">
              {metrics?.totalCollections || 0} collections
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-[#252021] p-5 rounded-2xl border border-elara-border-light dark:border-elara-border-dark shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark">
              Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52] dark:text-elara-accent-dark">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-elara-text-dark dark:text-elara-text-light">
              {metrics?.totalOrders || 0}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Direct boutique orders
            </span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-[#252021] p-5 rounded-2xl border border-elara-border-light dark:border-elara-border-dark shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark">
              Low Stock Alerts
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-amber-700 dark:text-amber-400">
              {metrics?.lowStockProducts.length || 0}
            </span>
            <span className="text-[11px] text-elara-text-muted block mt-1">Requires studio replenishment</span>
          </div>
        </div>
      </div>

      {/* 3. Tables Section: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#252021] rounded-3xl p-6 border border-elara-border-light dark:border-elara-border-dark shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
                Recent Customer Orders
              </h2>
              <span className="text-xs text-elara-text-muted">Live checkout submissions</span>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-[#8A4A52] dark:text-elara-accent-dark hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {metrics?.recentOrders && metrics.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-elara-border-light/70 dark:border-elara-border-dark/70 text-elara-text-muted uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-elara-border-light/40 dark:divide-elara-border-dark/40">
                  {metrics.recentOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-[#FFF9F7] dark:hover:bg-[#191516] transition-colors">
                      <td className="py-3 font-mono font-medium text-elara-text-dark dark:text-elara-text-light">
                        {order.orderId}
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-elara-text-dark dark:text-elara-text-light block">
                          {order.customer?.fullName || 'Boutique Patron'}
                        </span>
                        <span className="text-[11px] text-elara-text-muted truncate block max-w-[150px]">
                          {order.customer?.email}
                        </span>
                      </td>
                      <td className="py-3 text-elara-text-muted">{order.date}</td>
                      <td className="py-3 font-serif font-bold text-[#8A4A52] dark:text-elara-accent-dark">
                        {formatINR(order.total)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                            order.status || 'Pending'
                          )}`}
                        >
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-elara-text-muted">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <span>No customer orders recorded yet.</span>
            </div>
          )}
        </div>

        {/* Low Stock Items (1 Column) */}
        <div className="bg-white dark:bg-[#252021] rounded-3xl p-6 border border-elara-border-light dark:border-elara-border-dark shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
                Low Inventory
              </h2>
              <span className="text-xs text-elara-text-muted">&le; 5 items in studio</span>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-[#8A4A52] dark:text-elara-accent-dark hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {metrics?.lowStockProducts && metrics.lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {metrics.lowStockProducts.slice(0, 6).map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light/60 dark:border-elara-border-dark"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-medium truncate text-elara-text-dark dark:text-elara-text-light">
                        {prod.name}
                      </h4>
                      <span className="text-[11px] text-elara-text-muted">{formatINR(prod.price)}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono text-[11px] font-bold shrink-0">
                    {prod.stockCount} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-60" />
              <span>All inventory is healthy. No items below safety thresholds.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

