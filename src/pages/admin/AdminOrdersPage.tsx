import React, { useState, useEffect } from 'react';
import { AdminService } from '../../services/adminService';
import { UserOrder, OrderStatus } from '../../types';
import { formatINR } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  X,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export const AdminOrdersPage: React.FC = () => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Selected Order for Detail Drawer
  const [activeOrder, setActiveOrder] = useState<UserOrder | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getOrders(searchQuery, selectedStatus);
      setOrders(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await AdminService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
      if (activeOrder && activeOrder.orderId === orderId) {
        setActiveOrder(updated);
      }
      showToast(`Order ${orderId} status changed to ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-elara-border-light dark:border-elara-border-dark">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-elara-accent-light dark:text-elara-accent-dark">
            Fulfillment & Logistics
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light mt-0.5">
            Customer Orders ({orders.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-elara-border-light dark:border-elara-border-dark text-xs font-semibold uppercase tracking-wider hover:bg-[#F7E9E7] dark:hover:bg-[#302729]"
        >
          Refresh Live
        </button>
      </div>

      {/* 2. Search & Status Filter Bar */}
      <div className="bg-white dark:bg-[#252021] p-4 rounded-2xl border border-elara-border-light dark:border-elara-border-dark shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-xs"
          />
          <Search className="w-4 h-4 text-elara-text-muted absolute left-3 top-2.5" />
        </form>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['All', ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedStatus === st
                  ? 'bg-[#8A4A52] text-white shadow-sm'
                  : 'bg-[#FFF9F7] dark:bg-[#191516] text-elara-text-muted hover:text-elara-text-dark border border-elara-border-light/60 dark:border-elara-border-dark'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Orders Table */}
      <div className="bg-white dark:bg-[#252021] rounded-3xl border border-elara-border-light dark:border-elara-border-dark shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 mx-auto border-2 border-[#8A4A52] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-elara-text-muted mt-3 block">Loading orders...</span>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FFF9F7] dark:bg-[#191516] border-b border-elara-border-light dark:border-elara-border-dark text-[10px] font-bold uppercase tracking-wider text-elara-text-muted">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-elara-border-light/40 dark:divide-elara-border-dark/40">
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-[#FFF9F7]/70 dark:hover:bg-[#191516]/70 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-elara-text-dark dark:text-elara-text-light">
                      {order.orderId}
                    </td>

                    <td className="py-3 px-4 text-elara-text-muted">
                      {order.date}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-elara-text-dark dark:text-elara-text-light block">
                        {order.customer?.fullName || 'Patron'}
                      </span>
                      <span className="text-[11px] text-elara-text-muted truncate block max-w-[140px]">
                        {order.customer?.email}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-elara-text-muted">
                      {order.customer?.city}, {order.customer?.pincode}
                    </td>

                    <td className="py-3 px-4 font-medium">
                      {order.items?.length || 0} item(s)
                    </td>

                    <td className="py-3 px-4 font-serif font-bold text-[#8A4A52] dark:text-elara-accent-dark">
                      {formatINR(order.total)}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={order.status || 'Pending'}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none ${getStatusBadge(
                          order.status || 'Pending'
                        )}`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveOrder(order)}
                        className="px-3 py-1.5 rounded-xl border border-elara-border-light dark:border-elara-border-dark hover:bg-[#F7E9E7] dark:hover:bg-[#302729] font-semibold text-[11px]"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-elara-text-muted">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <span>No orders match your filter criteria.</span>
          </div>
        )}
      </div>

      {/* 4. Order Detail Drawer / Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#252021] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-2xl my-8 max-h-[90vh] overflow-y-auto space-y-6 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-elara-border-light dark:border-elara-border-dark">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold text-elara-text-dark dark:text-elara-text-light">
                    Order {activeOrder.orderId}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                      activeOrder.status || 'Pending'
                    )}`}
                  >
                    {activeOrder.status || 'Pending'}
                  </span>
                </div>
                <span className="text-[11px] text-elara-text-muted mt-0.5 block">
                  Placed on {activeOrder.date} • Tracking: <strong className="font-mono">{activeOrder.trackingNumber}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="p-1 rounded-lg text-elara-text-muted hover:text-elara-text-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Updater */}
            <div className="p-4 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark flex items-center justify-between">
              <span className="font-semibold uppercase tracking-wider text-elara-text-muted">
                Update Fulfillment Status:
              </span>
              <div className="flex items-center gap-1.5">
                {STATUS_OPTIONS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(activeOrder.orderId, st)}
                    className={`px-3 py-1.5 rounded-xl font-semibold uppercase text-[10px] tracking-wider transition-all ${
                      activeOrder.status === st
                        ? 'bg-[#8A4A52] text-white shadow-sm'
                        : 'bg-white dark:bg-[#252021] border border-elara-border-light text-elara-text-muted hover:text-elara-text-dark'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Shipping Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark space-y-2">
                <span className="font-bold uppercase tracking-wider text-[10px] text-elara-text-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8A4A52]" />
                  Recipient Customer
                </span>
                <p className="font-semibold text-sm">{activeOrder.customer?.fullName}</p>
                <p className="text-elara-text-muted flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {activeOrder.customer?.email}
                </p>
                <p className="text-elara-text-muted flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {activeOrder.customer?.phone}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark space-y-2">
                <span className="font-bold uppercase tracking-wider text-[10px] text-elara-text-muted flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8A4A52]" />
                  Delivery Destination
                </span>
                <p className="text-elara-text-muted leading-relaxed">
                  {activeOrder.customer?.addressLine1}
                  {activeOrder.customer?.addressLine2 && `, ${activeOrder.customer?.addressLine2}`}
                  <br />
                  {activeOrder.customer?.city}, {activeOrder.customer?.state} — {activeOrder.customer?.pincode}
                </p>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 block pt-1">
                  Payment Method: {activeOrder.paymentMethod}
                </span>
              </div>
            </div>

            {/* Gift Message (if any) */}
            {activeOrder.customer?.giftMessage && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
                <span className="font-bold uppercase text-[10px] tracking-wider block mb-1">
                  Custom Hand-Penned Gift Message:
                </span>
                <p className="italic font-serif text-xs">"{activeOrder.customer.giftMessage}"</p>
              </div>
            )}

            {/* Items Purchased List */}
            <div className="space-y-3">
              <span className="font-bold uppercase tracking-wider text-[10px] text-elara-text-muted block">
                Purchased Boutique Items ({activeOrder.items?.length || 0})
              </span>
              <div className="divide-y divide-elara-border-light/60 dark:divide-elara-border-dark border-t border-b border-elara-border-light dark:border-elara-border-dark">
                {activeOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=400&q=80'}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border"
                      />
                      <div>
                        <h4 className="font-semibold text-elara-text-dark dark:text-elara-text-light">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] text-elara-text-muted">
                          Qty: {item.quantity} • {formatINR(item.product.price)} each
                        </span>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-elara-text-dark dark:text-elara-text-light">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark space-y-1.5 text-xs">
              <div className="flex justify-between text-elara-text-muted">
                <span>Items Subtotal</span>
                <span>{formatINR(activeOrder.subtotal)}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promo Discount</span>
                  <span>-{formatINR(activeOrder.discount)}</span>
                </div>
              )}
              {activeOrder.giftWrapFee > 0 && (
                <div className="flex justify-between text-elara-text-muted">
                  <span>Signature Gift Wrap</span>
                  <span>{formatINR(activeOrder.giftWrapFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-elara-text-muted">
                <span>Shipping Fee</span>
                <span>{activeOrder.shippingFee === 0 ? 'Complimentary' : formatINR(activeOrder.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-elara-border-light dark:border-elara-border-dark text-[#8A4A52] dark:text-elara-accent-dark">
                <span>Total Amount Paid</span>
                <span className="font-serif">{formatINR(activeOrder.total)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="px-6 py-2.5 rounded-xl bg-[#8A4A52] text-white font-semibold uppercase text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

