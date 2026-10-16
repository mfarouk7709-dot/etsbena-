import React, { useState } from 'react';
import { Phone, MapPin, Clock, ShoppingBag, Search, Compass, ShieldCheck, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  const { totalItemsCount, subtotal, setIsCartOpen, setIsTrackingOpen, settings } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phone = settings?.phone || '01037313419';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const restaurantName = settings?.restaurantName || 'المطعم الإيطالي (رامبل زون)';

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-[#173D2B] text-[#FFF8EF] text-xs sm:text-sm py-2 px-4 border-b border-[#D9A441]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-1.5 hover:text-[#D9A441] transition-colors"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5 text-[#D9A441]" />
              <span className="font-semibold">+20 {cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}</span>
            </a>
            <span className="hidden sm:inline text-[#FFF8EF]/40">·</span>
            <div className="flex items-center gap-1.5 text-[#FFF8EF]/90">
              <MapPin className="w-3.5 h-3.5 text-[#C83B32]" />
              <span>Ramble Zone، قسم 15 مايو، القاهرة</span>
            </div>
            <span className="hidden md:inline text-[#FFF8EF]/40">·</span>
            <div className="hidden md:flex items-center gap-1.5 text-[#FFF8EF]/80">
              <Clock className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>{settings?.workingHours || 'يومياً من 12:00 ظهراً حتى 01:00 صباحاً'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="flex items-center gap-1 text-[#D9A441] hover:underline cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>تتبع حالة طلبك</span>
            </button>
            <span className="text-[#FFF8EF]/40">·</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-xs text-[#FFF8EF]/70 hover:text-white transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>لوحة الإدارة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#FFFFFF] border-b border-[#173D2B]/10 px-4 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#173D2B] flex items-center justify-center text-[#D9A441] shadow-md border border-[#D9A441]/30">
                <span className="text-xl sm:text-2xl font-serif">🍕</span>
              </div>
              <div className="text-right">
                <span className="block text-lg sm:text-xl font-bold text-[#173D2B] group-hover:text-[#C83B32] transition-colors leading-tight">
                  {restaurantName}
                </span>
                <span className="block text-xs text-[#173D2B]/70 font-medium">
                  Cucina Italiana · رامبل زون 15 مايو
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-[#173D2B] font-medium text-sm">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-[#C83B32] transition-colors cursor-pointer"
            >
              الرئيسية
            </button>
            <button
              onClick={() => scrollToSection('menu')}
              className="hover:text-[#C83B32] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>قائمة الطعام (المنيو)</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#C83B32] text-white rounded">طازج</span>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#C83B32] transition-colors cursor-pointer"
            >
              سر التميز الإيطالي
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="hover:text-[#C83B32] transition-colors cursor-pointer"
            >
              موقع المطعم وتواصل
            </button>
          </div>

          {/* Action CTAs: Cart & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-[#173D2B] hover:bg-[#1f5038] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
              aria-label="سلة المشتريات"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#D9A441]" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C83B32] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[11px] text-[#FFF8EF]/80 font-normal">السلة</span>
                <span className="text-xs font-bold text-[#D9A441]">
                  {subtotal > 0 ? `${subtotal} ج.م` : 'فارغة'}
                </span>
              </div>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#173D2B] hover:bg-[#FFF8EF] rounded-lg transition-colors cursor-pointer"
              aria-label="فتح القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#173D2B]/10 flex flex-col gap-3 pb-2 text-sm font-medium">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-right px-3 py-2 rounded hover:bg-[#FFF8EF] text-[#173D2B]"
            >
              الرئيسية
            </button>
            <button
              onClick={() => scrollToSection('menu')}
              className="text-right px-3 py-2 rounded hover:bg-[#FFF8EF] text-[#173D2B] flex items-center justify-between"
            >
              <span>قائمة الطعام (المنيو)</span>
              <span className="text-[10px] px-2 py-0.5 bg-[#C83B32] text-white rounded">أطباق إيطالية أصلية</span>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-right px-3 py-2 rounded hover:bg-[#FFF8EF] text-[#173D2B]"
            >
              سر التميز الإيطالي
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="text-right px-3 py-2 rounded hover:bg-[#FFF8EF] text-[#173D2B]"
            >
              موقع المطعم في رامبل زون 15 مايو
            </button>
            <div className="border-t border-[#173D2B]/10 pt-2 flex items-center justify-between px-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsTrackingOpen(true);
                }}
                className="text-[#D9A441] font-bold flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>تتبع طلب سابق</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-xs text-[#173D2B]/60 hover:text-[#173D2B] flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
                <span>لوحة تحكم المدير</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
