import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, Truck, ChefHat, AlertCircle, Phone, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types/restaurant';

export const OrderTrackModal: React.FC = () => {
  const { isTrackingOpen, setIsTrackingOpen, settings } = useCart();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  if (!isTrackingOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.trackOrder(query.trim());
      setOrder(res);
    } catch (err: any) {
      setError(err.message || 'لم نتمكن من العثور على هذا الطلب.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'new', label: 'تم الاستلام', desc: 'تم تسجيل الطلب في النظام' },
    { key: 'preparing', label: 'قيد التجهيز', desc: 'الطهي في الفرن الحجري' },
    { key: 'delivering', label: 'في الطريق', desc: 'مع مندوب التوصيل' },
    { key: 'delivered', label: 'تم التسليم', desc: 'بالهناء والشفاء' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 0;
      case 'preparing':
        return 1;
      case 'delivering':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-[#173D2B]/10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#173D2B] text-white flex items-center justify-between">
          <div className="text-right">
            <h2 className="text-base sm:text-lg font-bold">تتبع حالة طلبك</h2>
            <p className="text-xs text-[#FFF8EF]/80">أدخل رقم الطلب أو رقم هاتفك لمعرفة الحالة المباشرة</p>
          </div>
          <button
            onClick={() => setIsTrackingOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-right">
          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#173D2B] hover:bg-[#C83B32] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Search className="w-4 h-4 text-[#D9A441]" />
              <span>بحث</span>
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="رقم الطلب (مثال: ITL-4921) أو رقم الهاتف..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B] text-right"
            />
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {order && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Order Info Bar */}
              <div className="flex items-center justify-between p-3.5 bg-[#FFF8EF] rounded-2xl border border-[#D9A441]/30">
                <div>
                  <span className="text-[11px] text-gray-500 block">رقم الطلب</span>
                  <span className="font-mono font-bold text-base text-[#173D2B]">
                    #{order.orderNumber}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-[11px] text-gray-500 block">وقت الطلب</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {new Date(order.createdAt).toLocaleTimeString('ar-EG', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Status Visual Tracker */}
              {order.status === 'cancelled' ? (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
                  <span className="text-sm font-bold text-red-700">عذراً، هذا الطلب تم إلغاؤه</span>
                  <p className="text-xs text-red-600 mt-1">يرجى التواصل مع إدارة المطعم للاستفسار.</p>
                </div>
              ) : (
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {statusSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                              isCurrent
                                ? 'bg-[#C83B32] text-white ring-4 ring-[#C83B32]/20 shadow-md'
                                : isCompleted
                                ? 'bg-[#173D2B] text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {idx === 0 && <Clock className="w-4 h-4" />}
                            {idx === 1 && <ChefHat className="w-4 h-4" />}
                            {idx === 2 && <Truck className="w-4 h-4" />}
                            {idx === 3 && <CheckCircle className="w-4 h-4" />}
                          </div>
                          <span
                            className={`mt-2 text-[11px] font-bold block ${
                              isCurrent ? 'text-[#C83B32]' : isCompleted ? 'text-[#173D2B]' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </span>
                          <span className="text-[9px] text-gray-500 hidden sm:block">{step.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Items Details */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/60 space-y-2.5">
                <h4 className="text-xs font-bold text-gray-700 border-b border-gray-200 pb-1.5">
                  الأصناف المطلوبة:
                </h4>
                {order.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="text-right">
                      <span className="font-bold text-gray-800">
                        {it.quantity}x {it.nameAr}
                      </span>
                      {it.sizeName && <span className="text-gray-500 mr-1.5">({it.sizeName})</span>}
                      {it.extras && it.extras.length > 0 && (
                        <div className="text-[10px] text-gray-500">{it.extras.join(', ')}</div>
                      )}
                    </div>
                    <span className="font-bold text-[#173D2B]">{it.subtotal} ج.م</span>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-2 text-xs flex justify-between font-bold text-[#173D2B]">
                  <span>الإجمالي مع التوصيل:</span>
                  <span className="text-sm text-[#C83B32]">{order.total} ج.م</span>
                </div>
              </div>

              {/* Quick Contact Buttons */}
              <div className="flex gap-2">
                <a
                  href={`tel:${settings?.phone || '01037313419'}`}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#173D2B] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#23583e]"
                  dir="ltr"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>اتصال: {settings?.phone || '01037313419'}</span>
                </a>
                <a
                  href={`https://wa.me/201037313419?text=${encodeURIComponent(
                    `مرحباً، أستفسر بخصوص طلبي رقم #${order.orderNumber}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>متابعة واتساب</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
