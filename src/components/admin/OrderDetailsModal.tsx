import React, { useState } from 'react';
import { X, Phone, MapPin, Clock, CheckCircle2, Truck, ChefHat, AlertCircle, MessageCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types/restaurant';
import { api } from '../../services/api';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onStatusUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!order) return null;

  const handleUpdateStatus = async (status: OrderStatus) => {
    try {
      setLoading(true);
      setError(null);
      await api.updateOrderStatus(order.id, status);
      onStatusUpdated();
    } catch (err: any) {
      setError(err.message || 'فشل تحديث حالة الطلب');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">طلب جديد 🔔</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">قيد التجهيز 👨‍🍳</span>;
      case 'delivering':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800">في الطريق 🛵</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800">تم التسليم ✓</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800">ملغي ✕</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#173D2B]/10 max-h-[92vh] flex flex-col text-right animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#173D2B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base sm:text-lg font-bold">تفاصيل الطلب #{order.orderNumber}</h3>
            {getStatusBadge(order.status)}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Quick status actions bar */}
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
            <span className="block text-xs font-bold text-gray-700 mb-2">تحديث حالة الطلب السريعة:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={loading || order.status === 'new'}
                onClick={() => handleUpdateStatus('new')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-300 hover:bg-amber-50 cursor-pointer disabled:opacity-40"
              >
                جديد
              </button>
              <button
                type="button"
                disabled={loading || order.status === 'preparing'}
                onClick={() => handleUpdateStatus('preparing')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-300 hover:bg-blue-50 text-blue-800 cursor-pointer disabled:opacity-40"
              >
                قيد التحضير في المطبخ
              </button>
              <button
                type="button"
                disabled={loading || order.status === 'delivering'}
                onClick={() => handleUpdateStatus('delivering')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-300 hover:bg-purple-50 text-purple-800 cursor-pointer disabled:opacity-40"
              >
                خرج مع المندوب للتوصيل
              </button>
              <button
                type="button"
                disabled={loading || order.status === 'delivered'}
                onClick={() => handleUpdateStatus('delivered')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-300 hover:bg-green-50 text-green-800 cursor-pointer disabled:opacity-40"
              >
                تم التسليم بنجاح
              </button>
              <button
                type="button"
                disabled={loading || order.status === 'cancelled'}
                onClick={() => handleUpdateStatus('cancelled')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-300 hover:bg-red-50 text-red-700 cursor-pointer disabled:opacity-40"
              >
                إلغاء الطلب
              </button>
            </div>
          </div>

          {/* Customer & Delivery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-2">
              <span className="text-xs font-bold text-gray-500 block">بيانات العميل:</span>
              <h4 className="text-sm font-black text-gray-900">{order.customerName}</h4>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${order.customerPhone}`}
                  className="text-xs font-mono font-bold text-[#173D2B] hover:underline"
                  dir="ltr"
                >
                  {order.customerPhone}
                </a>
                <a
                  href={`https://wa.me/2${order.customerPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold hover:bg-green-200"
                >
                  واتساب
                </a>
              </div>
              <div className="text-xs text-gray-600 pt-1">
                طريقة الدفع: <span className="font-bold">{order.paymentMethod === 'cash' ? 'كاش عند الاستلام' : 'بطاقة POS'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-2">
              <span className="text-xs font-bold text-gray-500 block">طريقة ومكان الاستلام:</span>
              <h4 className="text-sm font-bold text-gray-900">
                {order.deliveryType === 'delivery' ? 'توصيل منزلي' : 'استلام من المطعم (تيك أواي)'}
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {order.deliveryAddress || 'استلام مباشر من المطعم (رامبل زون)'}
              </p>
              {order.deliveryZoneName && (
                <span className="text-[11px] text-gray-500 block">المنطقة: {order.deliveryZoneName}</span>
              )}
            </div>
          </div>

          {order.orderNotes && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block mb-0.5">ملاحظات العميل:</span>
              {order.orderNotes}
            </div>
          )}

          {/* Ordered items list */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 mb-2">الأصناف المطلوبة بالفاتورة:</h4>
            <div className="border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden">
              {order.items.map((it, idx) => (
                <div key={idx} className="p-3.5 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">
                      {it.quantity}x {it.nameAr}
                    </span>
                    {it.sizeName && <span className="text-[#C83B32] mr-2">[{it.sizeName}]</span>}
                    {it.extras && it.extras.length > 0 && (
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {it.extras.join(' · ')}
                      </div>
                    )}
                    {it.specialNotes && (
                      <div className="text-[10px] text-gray-600 mt-0.5 italic">
                        ملاحظة: {it.specialNotes}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-[#173D2B] text-sm shrink-0">
                    {it.subtotal} ج.م
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial summary */}
          <div className="p-4 bg-[#FFF8EF] rounded-2xl border border-[#D9A441]/30 text-xs space-y-1.5">
            <div className="flex justify-between text-gray-700">
              <span>المجموع الفرعي:</span>
              <span className="font-bold">{order.subtotal} ج.م</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>رسوم التوصيل:</span>
              <span className="font-bold">{order.deliveryFee} ج.م</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#173D2B] pt-2 border-t border-[#D9A441]/30">
              <span>الإجمالي المطلوب تحصيله:</span>
              <span className="text-[#C83B32]">{order.total} ج.م</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
