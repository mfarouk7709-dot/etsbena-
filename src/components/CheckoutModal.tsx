import React, { useState } from 'react';
import { X, Send, Phone, CheckCircle2, MessageCircle, ArrowRight, ShieldCheck, MapPin, CreditCard, Banknote, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Order } from '../types/restaurant';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    deliveryType,
    setDeliveryType,
    selectedZone,
    setSelectedZone,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsTrackingOpen,
    settings,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card_pos'>('cash');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    setIsCheckoutOpen(false);
    // Reset order state after close
    if (completedOrder) {
      setCompletedOrder(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('يرجى إدخال اسمك الكريم.');
      return;
    }
    const cleanPhone = customerPhone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('يرجى إدخال رقم هاتف صحيح مكوّن من 11 رقماً (مثل 01037313419).');
      return;
    }
    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      setError('يرجى كتابة عنوان التوصيل بالتفصيل (اسم الشارع، رقم العقار، الدور، علامة مميزة في 15 مايو).');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customerName,
        customerPhone: cleanPhone,
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : 'استلام من المطعم (رامبل زون)',
        deliveryZoneId: selectedZone?.id || '',
        orderNotes,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          selectedSizeId: item.selectedSize?.id,
          selectedExtraIds: item.selectedExtras.map((e) => e.id),
          quantity: item.quantity,
          specialNotes: item.specialNotes,
        })),
      };

      const res = await api.submitOrder(payload);
      setCompletedOrder(res.order);
      setWhatsappUrl(res.whatsappUrl);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'تعذر إرسال الطلب، يرجى مراجعة البيانات والمحاولة مجدداً.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackThisOrder = () => {
    setIsCheckoutOpen(false);
    setIsTrackingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-[#173D2B]/10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#173D2B] text-white flex items-center justify-between">
          <div className="text-right">
            <h2 className="text-base sm:text-lg font-bold">
              {completedOrder ? 'تم تأكيد وحفظ الطلب بنجاح' : 'إتمام وتأكيد الطلب'}
            </h2>
            <p className="text-xs text-[#FFF8EF]/80">
              {completedOrder
                ? `طلب رقم #${completedOrder.orderNumber}`
                : 'أدخل بياناتك للتوصيل السريع أو الاستلام'}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-right">
          {completedOrder ? (
            /* SUCCESS CONFIRMATION SCREEN */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-[#173D2B]/10 text-[#173D2B] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#173D2B]" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#173D2B]">
                  شكراً لك يا {completedOrder.customerName}!
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  تم تسجيل طلبك رسمياً في نظام المطعم برقم:{' '}
                  <span className="font-bold text-[#C83B32] font-mono text-base">
                    #{completedOrder.orderNumber}
                  </span>
                </p>
              </div>

              {/* Order quick recap card */}
              <div className="bg-[#FFF8EF] p-4 rounded-2xl border border-[#D9A441]/30 text-right text-xs space-y-2">
                <div className="flex justify-between font-bold text-gray-800 border-b border-[#D9A441]/20 pb-1.5">
                  <span>طريقة الاستلام:</span>
                  <span>{completedOrder.deliveryType === 'delivery' ? 'توصيل للمنزل' : 'استلام من المطعم'}</span>
                </div>
                {completedOrder.deliveryType === 'delivery' && (
                  <div className="flex justify-between text-gray-700">
                    <span>العنوان:</span>
                    <span className="font-medium max-w-[240px] truncate">{completedOrder.deliveryAddress}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>طريقة الدفع:</span>
                  <span>{completedOrder.paymentMethod === 'cash' ? 'كاش عند الاستلام' : 'بطاقة بنكية (POS)'}</span>
                </div>
                <div className="flex justify-between font-extrabold text-[#173D2B] text-sm pt-1.5 border-t border-[#D9A441]/20">
                  <span>الإجمالي المطلوب:</span>
                  <span className="text-[#C83B32]">{completedOrder.total} ج.م</span>
                </div>
              </div>

              {/* Important WhatsApp Notice as per prompt instructions */}
              <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3.5 rounded-xl text-xs text-right leading-relaxed">
                <span className="font-bold block mb-1">💡 تنبيه بخصوص إرسال الواتساب:</span>
                تم حفظ طلبك وإرساله للمطبخ بنجاح. يمكنك أيضاً الضغط أدناه لإرسال تفاصيل الفاتورة مباشرة عبر واتساب للمطعم لمتابعة تجهيز الطلب وللتواصل الفوري مع الإدارة.
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer text-sm sm:text-base"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>إرسال تفاصيل الفاتورة عبر واتساب المطعم</span>
                  </a>
                )}

                <a
                  href={`tel:${settings?.phone || '01037313419'}`}
                  className="w-full flex items-center justify-center gap-2 bg-[#173D2B] hover:bg-[#23583e] text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer text-sm"
                  dir="ltr"
                >
                  <Phone className="w-4 h-4 text-[#D9A441]" />
                  <span>اتصال مباشر: {settings?.phone || '01037313419'}</span>
                </a>

                <button
                  type="button"
                  onClick={handleTrackThisOrder}
                  className="w-full text-xs font-bold text-[#173D2B] hover:underline py-2 cursor-pointer"
                >
                  تتبع حالة الطلب في صفحة المتابعة
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Delivery / Pickup Choice */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">طريقة استلام الطلب:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'border-[#173D2B] bg-[#173D2B] text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🛵 توصيل للمنزل
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'border-[#173D2B] bg-[#173D2B] text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🏪 استلام من المطعم (رامبل زون)
                  </button>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  اسم العميل الكريم <span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="الاسم ثلاثي أو ثنائي"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
                />
              </div>

              {/* Customer Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  رقم الهاتف (للتواصل والتوصيل) <span className="text-red-500">*</span>:
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
                  dir="ltr"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block text-right">
                  يرجى التأكد من أن الرقم متصل وعليه واتساب للتواصل السريع.
                </span>
              </div>

              {/* Delivery Zone & Address */}
              {deliveryType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      المنطقة في 15 مايو وضواحيها:
                    </label>
                    <select
                      value={selectedZone?.id || ''}
                      onChange={(e) => {
                        const z = settings?.deliveryZones.find((item) => item.id === e.target.value);
                        if (z) setSelectedZone(z);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
                    >
                      {settings?.deliveryZones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} - رسوم التوصيل {z.fee} ج.م (وقت تقديري: {z.estimatedTime})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      عنوان التوصيل بالتفصيل <span className="text-red-500">*</span>:
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="اسم الحي / المجاورة، اسم الشارع، رقم العمارة، الشقة، علامة مميزة..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
                    />
                  </div>
                </>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">طريقة الدفع المتاحة:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-[#173D2B] bg-[#173D2B]/5 text-[#173D2B] font-bold'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#D9A441]" />
                    <span>الدفع نقداً (كاش)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card_pos')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'card_pos'
                        ? 'border-[#173D2B] bg-[#173D2B]/5 text-[#173D2B] font-bold'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#173D2B]" />
                    <span>فيزا / بطاقة عند الاستلام</span>
                  </button>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ملاحظات إضافية على الطلب (اختياري):
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="مثال: رن الجرس بدلاً من الطرق، تجهيز فكة لمبلغ 500 ج.م..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
                />
              </div>

              {/* Bill Breakdown */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي ({items.length} صنف):</span>
                  <span className="font-bold text-gray-900">{subtotal} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>رسوم التوصيل:</span>
                  <span className="font-bold text-[#173D2B]">
                    {deliveryType === 'delivery' ? `${deliveryFee} ج.م` : '0 ج.م'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#173D2B] pt-1.5 border-t border-gray-200">
                  <span>المبلغ الإجمالي النهائي:</span>
                  <span className="text-[#C83B32]">{total} ج.م</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-[#173D2B] hover:bg-[#C83B32] disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all cursor-pointer text-sm sm:text-base active:scale-95 mt-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري حفظ واعتماد طلبك...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#D9A441]" />
                    <span>تأكيد وتسجيل الطلب الرسمي ({total} ج.م)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
