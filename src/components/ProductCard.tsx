import React from 'react';
import { Plus, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types/restaurant';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If product has sizes or extras, open modal to let user choose
    if ((product.sizes && product.sizes.length > 0) || (product.extras && product.extras.length > 0)) {
      onOpenDetails(product);
    } else {
      addItem(product);
    }
  };

  const hasCustomizations =
    (product.sizes && product.sizes.length > 0) ||
    (product.extras && product.extras.length > 0);

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-[#173D2B]/10 hover:border-[#D9A441] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col cursor-pointer ${
        !product.isAvailable ? 'opacity-70 grayscale-30' : ''
      }`}
    >
      {/* Product Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.nameAr}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {product.isFeatured && (
            <span className="bg-[#C83B32] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
              مميز 🔥
            </span>
          )}
          {!product.isAvailable && (
            <span className="bg-gray-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
              غير متوفر اليوم
            </span>
          )}
        </div>

        {/* Preparation Time if available */}
        {product.preparationTime && (
          <div className="absolute bottom-2.5 right-2.5 bg-[#173D2B]/85 text-[#FFF8EF] text-[10px] px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#D9A441]" />
            <span>{product.preparationTime}</span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-right">
        <div>
          {/* Titles */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#173D2B] group-hover:text-[#C83B32] transition-colors leading-snug">
                {product.nameAr}
              </h3>
              {product.nameEn && (
                <span className="block text-xs text-gray-500 font-sans tracking-tight" dir="ltr">
                  {product.nameEn}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Options hints */}
          {hasCustomizations && (
            <div className="mt-2.5 flex items-center gap-2 text-[11px] text-[#173D2B]/70">
              {product.sizes && product.sizes.length > 0 && (
                <span className="bg-[#FFF8EF] border border-[#D9A441]/30 px-2 py-0.5 rounded text-[#173D2B]">
                  {product.sizes.length} أحجام متاحة
                </span>
              )}
              {product.extras && product.extras.length > 0 && (
                <span className="bg-[#FFF8EF] border border-[#173D2B]/15 px-2 py-0.5 rounded text-[#173D2B]">
                  إضافات اختيارية
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black text-[#173D2B]">
                {product.price}
              </span>
              <span className="text-xs font-bold text-[#C83B32]">ج.م</span>
            </div>
            {product.sizes && product.sizes.length > 0 && (
              <span className="text-[10px] text-gray-600 block">يبدأ من</span>
            )}
          </div>

          <div>
            {product.isAvailable ? (
              <button
                onClick={handleQuickAdd}
                className="flex items-center gap-1.5 bg-[#173D2B] hover:bg-[#C83B32] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4 text-[#D9A441]" />
                <span>{hasCustomizations ? 'تخصيص وإضافة' : 'إضافة'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 text-gray-600" />
                <span>نفد مؤقتاً</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
