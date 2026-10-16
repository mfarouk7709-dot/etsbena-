import React from 'react';
import { Utensils, ShoppingBag, MapPin, Sparkles, Flame, Award, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Hero: React.FC = () => {
  const { setIsCartOpen, settings } = useCart();

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLocation = () => {
    const el = document.getElementById('location');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const restaurantName = settings?.restaurantName || 'المطعم الإيطالي (رامبل زون)';
  const slogan = settings?.slogan || 'المذاق الإيطالي الأصيل بأيدي أمهر الطهاة وفي قلب رامبل زون 15 مايو';

  return (
    <section id="hero" className="relative bg-[#173D2B] text-white overflow-hidden py-12 lg:py-20">
      {/* Decorative background texture & glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D9A441_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C83B32]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D9A441]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Pill/Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EF]/10 border border-[#D9A441]/40 text-[#D9A441] text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#C83B32] animate-ping"></span>
              <span>بيتزا نابوليتانا وباستا طازجة · رامبل زون 15 مايو</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFF8EF] leading-[1.25]">
              المذاق الإيطالي الأصيل <br className="hidden sm:inline" />
              <span className="text-[#D9A441]">في قلب رامبل زون</span> - 15 مايو
            </h1>

            {/* Subheading / Description */}
            <p className="text-base sm:text-lg text-[#FFF8EF]/80 max-w-2xl leading-relaxed">
              {slogan}. نخبز عجينة البيتزا المخمرة طبيعياً لمدة 48 ساعة في أفران حجرية مخصصة، ونقدم الباستا الطازجة بصلصات إيطالية غنية وزيت زيتون بكر ممتاز.
            </p>

            {/* Action Buttons Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={scrollToMenu}
                className="flex items-center justify-center gap-2 bg-[#C83B32] hover:bg-[#b02f26] text-white font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95 text-sm sm:text-base"
              >
                <Utensils className="w-5 h-5" />
                <span>استعرض قائمة الطعام</span>
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#D9A441] hover:bg-[#c29035] text-[#173D2B] font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95 text-sm sm:text-base"
              >
                <ShoppingBag className="w-5 h-5 text-[#173D2B]" />
                <span>ابدأ طلبك الآن</span>
              </button>

              <button
                onClick={scrollToLocation}
                className="flex items-center justify-center gap-2 bg-[#FFF8EF]/15 hover:bg-[#FFF8EF]/25 text-[#FFF8EF] border border-[#FFF8EF]/20 font-medium px-5 py-3.5 rounded-xl transition-all duration-200 cursor-pointer text-sm sm:text-base"
              >
                <MapPin className="w-4 h-4 text-[#C83B32]" />
                <span>موقع المطعم على الخريطة</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#FFF8EF]/15 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-[#FFF8EF]/90">
                <Flame className="w-4 h-4 text-[#C83B32] shrink-0" />
                <span>فرن حجري 450°C</span>
              </div>
              <div className="flex items-center gap-2 text-[#FFF8EF]/90">
                <Award className="w-4 h-4 text-[#D9A441] shrink-0" />
                <span>دقيق وموزاريلا إيطالية</span>
              </div>
              <div className="flex items-center gap-2 text-[#FFF8EF]/90 col-span-2 sm:col-span-1">
                <Clock className="w-4 h-4 text-[#D9A441] shrink-0" />
                <span>توصيل سريع ساخن وطازج</span>
              </div>
            </div>

          </div>

          {/* Visual Showcase Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#D9A441] to-[#C83B32] rounded-3xl opacity-30 blur-lg transform -rotate-1"></div>

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D9A441]/40 bg-[#173D2B]">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85"
                  alt="بيتزا نابوليتانا إيطالية طازجة"
                  className="w-full h-80 sm:h-96 lg:h-[430px] object-cover hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#173D2B] via-[#173D2B]/85 to-transparent p-5 text-right">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#C83B32] text-white">
                      الأكثر طلباً
                    </span>
                    <span className="text-[#D9A441] font-bold text-sm">عجينة ساوردو 48 ساعة</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#FFF8EF]">بيتزا مارجريتا D.O.P & باستا يدوية</h3>
                  <p className="text-xs text-[#FFF8EF]/75">تُحضر يومياً بأيدي شيف إيطالي متخصص في رامبل زون</p>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#FFFFFF] text-[#173D2B] p-3.5 rounded-xl shadow-xl border border-[#173D2B]/10 max-w-[210px] hidden sm:block">
                <div className="flex items-center gap-1 text-[#D9A441] text-xs mb-1">
                  ★★★★★
                  <span className="text-[11px] text-gray-500 font-bold mr-1">(4.9/5)</span>
                </div>
                <p className="text-[11px] font-bold text-[#173D2B]">أفضل تجربة بيتزا إيطالية في 15 مايو</p>
                <span className="text-[10px] text-gray-500">تقييمات رواد رامبل زون</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
