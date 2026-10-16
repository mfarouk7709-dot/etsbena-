import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, ExternalLink, Navigation, Compass, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const LocationContactSection: React.FC = () => {
  const { settings } = useCart();

  const phone = settings?.phone || '01037313419';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const fullPhone = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone;
  const address = settings?.address || 'Ramble Zone، قسم 15 مايو، القاهرة، مصر';
  const workingHours = settings?.workingHours || 'يومياً من 12:00 ظهراً حتى 01:00 بعد منتصف الليل';
  const mapsUrl = settings?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=Ramble+Zone+15+May+Cairo`;

  return (
    <section id="location" className="py-16 sm:py-24 bg-[#FFF8EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#C83B32] text-xs sm:text-sm font-bold uppercase tracking-wider block mb-2">
            نسعد بزيارتكم وخدمتكم
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173D2B]">
            موقع المطعم وبيانات التواصل
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
            تفضل بزيارتنا في رامبل زون 15 مايو للاستمتاع بأجواء إيطالية دافئة، أو اطلب مباشرة عبر الهاتف وواتساب للتوصيل السريع إلى باب منزلك.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 text-right">
            
            {/* Phone Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#173D2B]/10 shadow-xs hover:border-[#D9A441] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#173D2B] text-[#D9A441] flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 font-semibold block">الاتصال المباشر والطلبات الهاتفية</span>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-lg font-black text-[#173D2B] hover:text-[#C83B32] transition-colors mt-0.5 inline-block"
                    dir="ltr"
                  >
                    +20 {cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}
                  </a>
                  <p className="text-xs text-gray-600 mt-1">خدمة عملاء وتوصيل مخصصة على مدار ساعات العمل</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#173D2B]/10 shadow-xs hover:border-[#25D366] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 font-semibold block">المحادثة عبر واتساب الرسمي</span>
                  <a
                    href={`https://wa.me/${fullPhone}?text=${encodeURIComponent('مرحباً، أود الاطلاع على المنيو وطلب وجبة من المطعم')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-black text-[#173D2B] hover:text-[#25D366] transition-colors mt-0.5 inline-flex items-center gap-2"
                  >
                    <span>تواصل معنا على واتساب</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                  <p className="text-xs text-gray-600 mt-1">إرسال الفواتير والموقع الجغرافي وتأكيد التوصيل الفوري</p>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#173D2B]/10 shadow-xs hover:border-[#C83B32] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C83B32] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 font-semibold block">العنوان الجغرافي الدقيق</span>
                  <h4 className="text-base font-bold text-[#173D2B] mt-0.5">{address}</h4>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C83B32] hover:underline mt-2"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>فتح الموقع في خرائط Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#173D2B]/10 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D9A441] text-[#173D2B] flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 font-semibold block">مواعيد العمل واستقبال الطلبات</span>
                  <h4 className="text-sm font-bold text-[#173D2B] mt-0.5">{workingHours}</h4>
                  <span className="text-xs text-gray-500 block mt-1">متاح طوال أيام الأسبوع (شامل الجمعة والسبت)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Maps Showcase Container */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border border-[#173D2B]/10 shadow-md flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3 text-right">
              <div>
                <h3 className="text-base font-bold text-[#173D2B] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C83B32]" />
                  <span>Ramble Zone - قسم 15 مايو</span>
                </h3>
                <span className="text-xs text-gray-500">القاهرة، جمهورية مصر العربية</span>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#173D2B] hover:bg-[#C83B32] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <span>اتجاهات السير</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D9A441]" />
              </a>
            </div>

            {/* Map Frame Preview */}
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 w-full bg-gray-100 border border-gray-200">
              <iframe
                title="Google Maps Location - Ramble Zone 15 May"
                src="https://maps.google.com/maps?q=Ramble+Zone+15+May+Cairo+Egypt&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter saturate-110"
              ></iframe>

              {/* Pin info banner on top */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-lg border border-gray-200 text-right max-w-xs">
                <span className="text-[11px] font-bold text-[#C83B32] block">📍 موقع المطعم:</span>
                <p className="text-xs font-bold text-[#173D2B]">Ramble Zone، 15 مايو</p>
                <span className="text-[10px] text-gray-500">مواقف سيارات متوفرة ومنطقة عائلية مريحة</span>
              </div>
            </div>

            {/* Direct Directions & Fast Delivery zones notice */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
              <span>مناطق التغطية بالتوصيل: قسم 15 مايو بكافة مجاوراته، حلوان، وضواحي جنوب القاهرة.</span>
              <span className="font-bold text-[#173D2B]">توصيل ساخن بأكياس حرارية</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
