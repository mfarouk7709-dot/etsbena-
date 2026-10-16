import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Minus, ShoppingBag, Clock, Sparkles } from 'lucide-react';
import { Product, ProductSize, ProductExtra } from '../types/restaurant';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(undefined);
  const [selectedExtras, setSelectedExtras] = useState<ProductExtra[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  useEffect(() => {
    if (product) {
      // Set default size if exists
      if (product.sizes && product.sizes.length > 0) {
        const defaultSize = product.sizes.find((s) => s.isDefault) || product.sizes[0];
        setSelectedSize(defaultSize);
      } else {
        setSelectedSize(undefined);
      }
      setSelectedExtras([]);
      setQuantity(1);
      setSpecialNotes('');
    }
  }, [product]);

  if (!product) return null;

  const toggleExtra = (extra: ProductExtra) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  // Calculate unit price and total price
  let basePrice = product.price;
  if (selectedSize) {
    basePrice = selectedSize.price;
  }
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const unitPrice = basePrice + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedExtras, quantity, specialNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-[#173D2B]/10 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black shadow-md transition-all cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-56 sm:h-64 w-full bg-[#173D2B] shrink-0">
          <img
            src={product.image}
            alt={product.nameAr}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

          <div className="absolute bottom-4 right-4 left-4 text-right text-white">
            <h2 className="text-xl sm:text-2xl font-bold">{product.nameAr}</h2>
            {product.nameEn && (
              <p className="text-xs sm:text-sm text-gray-200" dir="ltr">
                {product.nameEn}
              </p>
            )}
          </div>
        </div>

        {/* Modal Body / Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-right">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-600 mb-1">وصف الصنف والمكونات:</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Sizes Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#C83B32] font-semibold">* مطلوب اختيار واحد</span>
                <h4 className="text-sm font-bold text-[#173D2B]">اختر الحجم:</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize?.id === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#173D2B] bg-[#173D2B]/5 text-[#173D2B] font-bold shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#173D2B] bg-[#173D2B]' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                        <span className="text-sm">{size.nameAr}</span>
                      </div>
                      <span className="text-xs font-bold text-[#C83B32]">{size.price} ج.م</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extras Selection */}
          {product.extras && product.extras.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">اختياري</span>
                <h4 className="text-sm font-bold text-[#173D2B]">إضافات إيطالية خاصة:</h4>
              </div>
              <div className="space-y-2">
                {product.extras.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        isChecked
                          ? 'border-[#D9A441] bg-[#FFF8EF] text-[#173D2B] font-semibold shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked
                              ? 'border-[#D9A441] bg-[#D9A441] text-[#173D2B]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-sm">{extra.nameAr}</span>
                      </div>
                      <span className="text-xs font-bold text-[#173D2B]">+{extra.price} ج.م</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Notes */}
          <div>
            <h4 className="text-sm font-bold text-[#173D2B] mb-2">ملاحظات خاصة للشيف (اختياري):</h4>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="مثال: بدون بصل، صوص إضافي، تسوية مقرمشة..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#173D2B] text-sm text-gray-800 bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Modal Footer / Total & Add to Cart */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>
            <span className="w-10 text-center font-bold text-sm text-[#173D2B]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Add CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-[#173D2B] hover:bg-[#C83B32] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 cursor-pointer text-sm sm:text-base active:scale-95"
          >
            <ShoppingBag className="w-5 h-5 text-[#D9A441]" />
            <span>أضف إلى السلة · {totalPrice} ج.م</span>
          </button>
        </div>
      </div>
    </div>
  );
};
