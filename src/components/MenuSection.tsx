import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Sparkles, AlertCircle, Utensils, Pizza } from 'lucide-react';
import { Category, Product } from '../types/restaurant';
import { ProductCard } from './ProductCard';
import { api } from '../services/api';

interface MenuSectionProps {
  onSelectProduct: (product: Product) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectProduct }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [catsData, prodsData] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
      ]);
      setCategories(catsData);
      setProducts(prodsData);
    } catch (err: any) {
      console.error(err);
      setError('حدث خطأ أثناء تحميل قائمة الطعام. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      product.nameAr.toLowerCase().includes(q) ||
      (product.nameEn && product.nameEn.toLowerCase().includes(q)) ||
      product.description.toLowerCase().includes(q);
    const matchesAvailable = !onlyAvailable || product.isAvailable;

    return matchesCategory && matchesSearch && matchesAvailable;
  });

  return (
    <section id="menu" className="py-14 sm:py-20 bg-[#FFF8EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173D2B]/10 text-[#173D2B] text-xs font-bold mb-3">
            <Pizza className="w-3.5 h-3.5 text-[#C83B32]" />
            <span>قائمة طعام إيطالية متجددة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173D2B] tracking-tight">
            المنيو الإلكتروني التفاعلي
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
            استمتع بأشهى أطباق المطبخ الإيطالي المحضرة بشغف في رامبل زون 15 مايو. اختر صنفك المفضل وخصص الحجم والإضافات حسب رغبتك.
          </p>

          {/* Admin Modifiable Notice */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D9A441]/15 text-[#173D2B] text-xs border border-[#D9A441]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#173D2B]"></span>
            <span>بيانات المنيو والأسعار ومواعيد العمل قابلة للتحديث المستمر من لوحة الإدارة</span>
          </div>
        </div>

        {/* Search & Quick Filters Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#173D2B]/10 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن بيتزا، باستا، مكونات (مثل: ترفل، مارجريتا...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#173D2B] text-sm text-gray-800 placeholder-gray-600 bg-gray-50 focus:bg-white transition-all text-right"
              />
              <Search className="w-4 h-4 text-gray-600 absolute left-3 top-3.5" />
            </div>

            {/* Quick Toggles */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setOnlyAvailable(!onlyAvailable)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  onlyAvailable
                    ? 'border-[#173D2B] bg-[#173D2B] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>المتوفر للطلب الآن فقط</span>
                {onlyAvailable && <span className="text-[#D9A441]">✓</span>}
              </button>
            </div>
          </div>

          {/* Categories Pill Tabs */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#173D2B] text-[#FFF8EF] shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              جميع الأطباق ({products.length})
            </button>

            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#173D2B] text-[#FFF8EF] shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.nameAr}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-[#D9A441] text-[#173D2B]' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[#173D2B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">جاري تجهيز قائمة الأطباق الطازجة...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 text-[#C83B32] mx-auto mb-2" />
            <p className="text-sm font-bold">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 text-xs bg-[#C83B32] text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-2xs">
                <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800">لم نجد أي أطباق مطابقة لبحثك</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  جرب تغيير كلمات البحث أو اختيار تصنيف آخر من القائمة أعلاه.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setOnlyAvailable(false);
                  }}
                  className="mt-4 text-xs font-bold text-[#C83B32] hover:underline cursor-pointer"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
};
