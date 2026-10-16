import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Bike, Store, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    deliveryFee,
    total,
    selectedZone,
    setSelectedZone,
    deliveryType,
    setDeliveryType,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    settings,
  } = useCart();

  if (!isCartOpen) return null;

  const minOrderAmount = settings?.minOrderAmount || 60;
  const isBelowMin = deliveryType === 'delivery' && subtotal < minOrderAmount;

  const handleProceedToCheckout = () => {
    if (items.length === 0 || isBelowMin) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-start">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-[#173D2B]/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#173D2B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#D9A441]" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">سلة طلباتك</h2>
              <span className="text-xs text-[#FFF8EF]/80">
                {items.length} {items.length === 1 ? 'صنف' : 'أصناف مختارة'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="إغلاق السلة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Delivery Type Switcher */}
        <div className="p-3 bg-[#FFF8EF] border-b border-[#173D2B]/10">
          <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setDeliveryType('delivery')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                deliveryType === 'delivery'
                  ? 'bg-[#173D2B] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Bike className="w-4 h-4 text-[#D9A441]" />
              <span>توصيل للمنزل</span>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType('pickup')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                deliveryType === 'pickup'
                  ? 'bg-[#173D2B] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Store className="w-4 h-4 text-[#D9A441]" />
              <span>استلام من رامبل زون</span>
            </button>
          </div>

          {/* Delivery Zone Selection if delivery */}
          {deliveryType === 'delivery' && settings?.deliveryZones && (
            <div className="mt-2.5">
              <label className="block text-[11px] font-bold text-gray-700 mb-1 text-right">
                منطقة التوصيل (لتحديد رسوم المشوار بدقة):
              </label>
              <select
                value={selectedZone?.id || ''}
                onChange={(e) => {
                  const z = settings.deliveryZones.find((item) => item.id === e.target.value);
                  if (z) setSelectedZone(z);
                }}
                className="w-full text-xs font-semibold p-2 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#173D2B] text-right"
              >
                {settings.deliveryZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} (+{zone.fee} ج.م)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-800">سلتك لا تزال فارغة</h3>
              <p className="text-xs text-gray-500 mt-1">
                تصفح تشكيلة البيتزا والباستا الإيطالية وأضف أشهى الأطباق لبدء طلبك!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 text-xs font-bold bg-[#173D2B] text-white px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#C83B32] transition-colors"
              >
                تصفح قائمة الطعام
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="pt-3.5 first:pt-0 flex items-start gap-3 text-right">
                {/* Thumb */}
                <img
                  src={item.product.image}
                  alt={item.product.nameAr}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-sm font-bold text-[#173D2B] truncate">{item.product.nameAr}</h4>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-gray-400 hover:text-[#C83B32] p-1 transition-colors cursor-pointer"
                      title="حذف الصنف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.selectedSize && (
                    <span className="block text-[11px] text-[#C83B32] font-semibold">
                      الحجم: {item.selectedSize.nameAr}
                    </span>
                  )}

                  {item.selectedExtras.length > 0 && (
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {item.selectedExtras.map((e) => e.nameAr).join(' · ')}
                    </div>
                  )}

                  {item.specialNotes && (
                    <div className="text-[10px] text-gray-600 bg-gray-50 p-1 rounded mt-1 italic">
                      ملاحظة: {item.specialNotes}
                    </div>
                  )}

                  {/* Quantity & Item Subtotal */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-gray-600 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-gray-600 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-left font-bold text-sm text-[#173D2B]">
                      {item.unitPrice * item.quantity} <span className="text-[11px] text-[#C83B32]">ج.م</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary & Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-gray-200 shadow-lg space-y-3">
            {/* Calculation summary */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>المجموع الفرعي للأصناف:</span>
                <span className="font-bold text-gray-900">{subtotal} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {deliveryType === 'delivery'
                    ? `رسوم التوصيل (${selectedZone?.name?.split(' ')[0] || 'المشوار'}):`
                    : 'رسوم الاستلام من المطعم:'}
                </span>
                <span className="font-bold text-[#173D2B]">
                  {deliveryType === 'delivery' ? `${deliveryFee} ج.م` : 'مجاناً'}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#173D2B] pt-2 border-t border-gray-100">
                <span>الإجمالي النهائي المطلوب:</span>
                <span className="text-[#C83B32]">{total} ج.م</span>
              </div>
            </div>

            {/* Minimum order warning if needed */}
            {isBelowMin && (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-50 text-amber-800 text-xs border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  الحد الأدنى للطلب والتوصيل هو {minOrderAmount} ج.م (ينقصك {minOrderAmount - subtotal} ج.م).
                </span>
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={isBelowMin}
              className="w-full flex items-center justify-center gap-2 bg-[#173D2B] hover:bg-[#C83B32] disabled:opacity-50 disabled:hover:bg-[#173D2B] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 cursor-pointer text-sm sm:text-base active:scale-95"
            >
              <span>المتابعة لتأكيد الطلب والعنوان</span>
              <ArrowLeft className="w-4 h-4 text-[#D9A441]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
