import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image, DollarSign, Check, AlertCircle } from 'lucide-react';
import { Product, Category, ProductSize, ProductExtra } from '../../types/restaurant';
import { api } from '../../services/api';

interface ProductFormModalProps {
  isOpen: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  product,
  categories,
  onClose,
  onSaved,
}) => {
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(100);
  const [image, setImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [preparationTime, setPreparationTime] = useState('15-20 دقيقة');
  const [calories, setCalories] = useState<number | undefined>(750);

  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [extras, setExtras] = useState<ProductExtra[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setNameAr(product.nameAr);
      setNameEn(product.nameEn || '');
      setCategoryId(product.categoryId);
      setDescription(product.description);
      setPrice(product.price);
      setImage(product.image);
      setIsAvailable(product.isAvailable);
      setIsFeatured(product.isFeatured);
      setPreparationTime(product.preparationTime || '');
      setCalories(product.calories);
      setSizes(product.sizes || []);
      setExtras(product.extras || []);
    } else {
      setNameAr('');
      setNameEn('');
      setCategoryId(categories[0]?.id || '');
      setDescription('');
      setPrice(150);
      setImage('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80');
      setIsAvailable(true);
      setIsFeatured(false);
      setPreparationTime('15-20 دقيقة');
      setCalories(750);
      setSizes([
        { id: `sz-${Date.now()}-1`, nameAr: 'وسط (30 سم)', nameEn: 'Medium', price: 150, isDefault: true },
        { id: `sz-${Date.now()}-2`, nameAr: 'كبير (36 سم)', nameEn: 'Large', price: 200 },
      ]);
      setExtras([
        { id: `ex-${Date.now()}-1`, nameAr: 'جبنة موزاريلا إضافية', nameEn: 'Extra Mozzarella', price: 30 },
      ]);
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleAddSize = () => {
    setSizes([
      ...sizes,
      {
        id: `sz-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        nameAr: 'حجم جديد',
        nameEn: 'Size',
        price: price || 100,
      },
    ]);
  };

  const handleRemoveSize = (id: string) => {
    setSizes(sizes.filter((s) => s.id !== id));
  };

  const handleAddExtra = () => {
    setExtras([
      ...extras,
      {
        id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        nameAr: 'إضافة جديدة',
        nameEn: 'Extra',
        price: 25,
      },
    ]);
  };

  const handleRemoveExtra = (id: string) => {
    setExtras(extras.filter((e) => e.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nameAr.trim()) {
      setError('يرجى إدخال اسم الصنف بالعربية');
      return;
    }
    if (!categoryId) {
      setError('يرجى اختيار تصنيف الصنف');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        nameAr,
        nameEn,
        categoryId,
        description,
        price: Number(price),
        image: image.trim(),
        isAvailable,
        isFeatured,
        preparationTime,
        calories: calories ? Number(calories) : undefined,
        sizes,
        extras,
      };

      if (product) {
        await api.updateProduct(product.id, payload);
      } else {
        await api.createProduct(payload);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ الصنف');
    } finally {
      setLoading(false);
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
          <h3 className="text-base sm:text-lg font-bold">
            {product ? `تعديل صنف: ${product.nameAr}` : 'إضافة صنف إيطالي جديد للمنيو'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                اسم الصنف (بالعربية) <span className="text-red-500">*</span>:
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: بيتزا مارجريتا نابوليتانا"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                الاسم بالإنجليزية (اختياري):
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Pizza Margherita D.O.P"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                التصنيف <span className="text-red-500">*</span>:
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                السعر الأساسي (بالجنيه EGP) <span className="text-red-500">*</span>:
              </label>
              <input
                type="number"
                min={1}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">مدة التحضير التقريبية:</label>
              <input
                type="text"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                placeholder="15-20 دقيقة"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              رابط صورة الصنف (URL):
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
              dir="ltr"
            />
            {image && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={image}
                  alt="معاينة"
                  className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                />
                <span className="text-[11px] text-gray-500">معاينة مباشرة للصورة</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              وصف الصنف والمكونات بالتفصيل:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="صلصة طماطم سان مارزانو، موتزاريلا دي بوفالا، ريحان طازج، زيت زيتون بكر ممتاز..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-[#173D2B] focus:ring-[#173D2B]"
              />
              <span>متوفر للطلب في المنيو الآن</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#C83B32] focus:ring-[#C83B32]"
              />
              <span>صنف مميز (يظهر عليه شارة الأكثر طلباً)</span>
            </label>
          </div>

          {/* Sizes Configuration */}
          <div className="border border-gray-200 p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleAddSize}
                className="text-xs bg-[#173D2B] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة حجم</span>
              </button>
              <span className="text-xs font-bold text-[#173D2B]">أحجام الصنف وأسعارها:</span>
            </div>

            {sizes.length === 0 ? (
              <p className="text-[11px] text-gray-500">لا توجد أحجام متعددة (سيتم استخدام السعر الأساسي فقط).</p>
            ) : (
              sizes.map((sz, idx) => (
                <div key={sz.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(sz.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={sz.price}
                    onChange={(e) => {
                      const updated = [...sizes];
                      updated[idx].price = Number(e.target.value);
                      setSizes(updated);
                    }}
                    placeholder="السعر (ج.م)"
                    className="w-24 px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-center"
                    dir="ltr"
                  />
                  <input
                    type="text"
                    value={sz.nameAr}
                    onChange={(e) => {
                      const updated = [...sizes];
                      updated[idx].nameAr = e.target.value;
                      setSizes(updated);
                    }}
                    placeholder="اسم الحجم بالعربية"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                  />
                </div>
              ))
            )}
          </div>

          {/* Extras Configuration */}
          <div className="border border-gray-200 p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleAddExtra}
                className="text-xs bg-[#173D2B] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة خيار إضافي</span>
              </button>
              <span className="text-xs font-bold text-[#173D2B]">الإضافات الاختيارية وأسعارها:</span>
            </div>

            {extras.length === 0 ? (
              <p className="text-[11px] text-gray-500">لا توجد إضافات اختيارية لهذا الصنف.</p>
            ) : (
              extras.map((ex, idx) => (
                <div key={ex.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveExtra(ex.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={ex.price}
                    onChange={(e) => {
                      const updated = [...extras];
                      updated[idx].price = Number(e.target.value);
                      setExtras(updated);
                    }}
                    placeholder="+ السعر"
                    className="w-24 px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-center"
                    dir="ltr"
                  />
                  <input
                    type="text"
                    value={ex.nameAr}
                    onChange={(e) => {
                      const updated = [...extras];
                      updated[idx].nameAr = e.target.value;
                      setExtras(updated);
                    }}
                    placeholder="اسم الإضافة (مثل: جبن إضافي)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                  />
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#173D2B] hover:bg-[#C83B32] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ الصنف في قاعدة البيانات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
