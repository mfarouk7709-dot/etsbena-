import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Category } from '../../types/restaurant';
import { api } from '../../services/api';

interface CategoryFormModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  category,
  onClose,
  onSaved,
}) => {
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setNameAr(category.nameAr);
      setNameEn(category.nameEn);
      setDescription(category.description);
      setSortOrder(category.sortOrder);
      setIsActive(category.isActive);
    } else {
      setNameAr('');
      setNameEn('');
      setDescription('');
      setSortOrder(1);
      setIsActive(true);
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) {
      setError('يرجى إدخال اسم التصنيف بالعربية');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const payload = {
        nameAr,
        nameEn,
        description,
        icon: 'pizza',
        sortOrder: Number(sortOrder),
        isActive,
      };

      if (category) {
        await api.updateCategory(category.id, payload);
      } else {
        await api.createCategory(payload);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ التصنيف');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#173D2B]/10 p-6 text-right animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-[#173D2B] mb-4">
          {category ? `تعديل التصنيف: ${category.nameAr}` : 'إضافة تصنيف جديد في المنيو'}
        </h3>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              اسم التصنيف (بالعربية) <span className="text-red-500">*</span>:
            </label>
            <input
              type="text"
              required
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: ريزوتو ومخبوزات"
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
              placeholder="Risotto & Breads"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">وصف التصنيف:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف موجز يظهر تحت التصنيف..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">ترتيب الظهور:</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
              />
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#173D2B]"
                />
                <span>مفعل ويظهر في المنيو</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#173D2B] hover:bg-[#C83B32] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التصنيف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
