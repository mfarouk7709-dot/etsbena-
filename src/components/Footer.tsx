import React from 'react';
import { Phone, MapPin, MessageCircle, ShieldCheck, Heart, Clock, Compass } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { settings, setIsTrackingOpen } = useCart();

  const phone = settings?.phone || '01037313419';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const fullPhone = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone;
  const restaurantName = settings?.restaurantName || 'المطعم الإيطالي (رامبل زون)';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#173D2B] text-[#FFF8EF] border-t-4 border-[#D9A441] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10 text-right">
          
          {/* Brand & Bio */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-[#D9A441] border border-[#D9A441]/40 text-xl font-serif">
                🍕
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#FFF8EF]">{restaurantName}</h3>
                <span className="text-xs text-[#D9A441] font-semibold">Ramble Zone · 15 مايو</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#FFF8EF]/80 leading-relaxed max-w-sm">
              مطعم إيطالي متخصص في إعداد البيتزا النابولية بالفرن الحجري والباستا الإيطالية الطازجة يدوياً. نلتزم بأعلى معايير الجودة والنكهة الأصلية في قلب رامبل زون، قسم 15 مايو، القاهرة.
            </p>

            <div className="text-[11px] text-[#FFF8EF]/60 pt-2">
              <span className="text-[#D9A441] font-semibold">* تنويه:</span> الاسم التجاري وقائمة الأسعار ومواعيد العمل قابلة للتهيئة والتعديل الكامل من لوحة تحكم الإدارة.
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-[#D9A441] border-b border-white/10 pb-2 inline-block">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#FFF8EF]/80">
              <li>
                <button
                  onClick={() => scrollTo('hero')}
                  className="hover:text-[#D9A441] transition-colors cursor-pointer"
                >
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('menu')}
                  className="hover:text-[#D9A441] transition-colors cursor-pointer"
                >
                  قائمة الطعام (المنيو)
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('features')}
                  className="hover:text-[#D9A441] transition-colors cursor-pointer"
                >
                  سر التميز الإيطالي
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('location')}
                  className="hover:text-[#D9A441] transition-colors cursor-pointer"
                >
                  موقع المطعم في رامبل زون
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-[#D9A441] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Compass className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>تتبع طلبك بالرقم أو الهاتف</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-[#D9A441] border-b border-white/10 pb-2 inline-block">
              بيانات التواصل المباشر
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-[#FFF8EF]/85">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D9A441] shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:underline font-mono" dir="ltr">
                  +20 {cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${fullPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  واتساب الطلبات: 01037313419
                </a>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C83B32] shrink-0 mt-0.5" />
                <span>Ramble Zone، قسم 15 مايو، القاهرة، مصر</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D9A441] shrink-0" />
                <span>{settings?.workingHours || 'يومياً من 12:00 ظهراً حتى 01:00 بعد منتصف الليل'}</span>
              </div>
            </div>

            {/* Admin Dashboard Entry Button */}
            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#D9A441] hover:text-[#173D2B] text-xs font-bold transition-all cursor-pointer border border-white/15"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>دخول لوحة تحكم الإدارة</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFF8EF]/60 gap-3 text-center sm:text-right">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة · جميع الأسعار بالجنيه المصري (EGP).</p>
          <div className="flex items-center gap-1.5 justify-center">
            <span>صُنع بشغف لتقديم تجربة طعام إيطالية راقية</span>
            <span className="text-[#C83B32]">🇮🇹</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
