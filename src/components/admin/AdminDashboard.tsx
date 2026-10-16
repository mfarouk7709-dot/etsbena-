import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  LogOut,
  TrendingUp,
  ShoppingBag,
  Clock,
  DollarSign,
  Utensils,
  Layers,
  Settings as SettingsIcon,
  Search,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Save,
  Check,
} from 'lucide-react';
import {
  Product,
  Category,
  Order,
  RestaurantSettings,
  DashboardStats,
  DeliveryZone,
} from '../../types/restaurant';
import { api } from '../../services/api';
import { ProductFormModal } from './ProductFormModal';
import { CategoryFormModal } from './CategoryFormModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useCart } from '../../context/CartContext';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, onLogout }) => {
  const { refreshSettings } = useCart();

  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'products' | 'categories' | 'settings'>('stats');

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settingsForm, setSettingsForm] = useState<RestaurantSettings | null>(null);

  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData, prodsData, catsData, settingsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(),
        api.getProducts(),
        api.getAdminCategories(),
        api.getSettings(),
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setProducts(prodsData);
      setCategories(catsData);
      setSettingsForm(settingsData);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProductAvailability = async (product: Product) => {
    try {
      const updated = await api.updateProduct(product.id, {
        isAvailable: !product.isAvailable,
      });
      setProducts(products.map((p) => (p.id === product.id ? updated : p)));
    } catch (err: any) {
      alert(err.message || 'فشل تحديث حالة الصنف');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف الصنف "${name}" نهائياً من المنيو؟`)) {
      return;
    }
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'فشل حذف الصنف');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف التصنيف "${name}"؟`)) {
      return;
    }
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'فشل حذف التصنيف');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;

    try {
      setSavingSettings(true);
      setFeedbackMessage(null);
      await api.updateSettings(settingsForm);
      await refreshSettings();
      setFeedbackMessage('تم حفظ إعدادات المطعم والتوصيل بنجاح!');
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'فشل حفظ الإعدادات');
    } finally {
      setSavingSettings(false);
    }
  };

  // Add a delivery zone
  const handleAddZone = () => {
    if (!settingsForm) return;
    const newZone: DeliveryZone = {
      id: `zone-${Date.now()}`,
      name: 'منطقة جديدة',
      fee: 25,
      estimatedTime: '30-40 دقيقة',
    };
    setSettingsForm({
      ...settingsForm,
      deliveryZones: [...settingsForm.deliveryZones, newZone],
    });
  };

  const handleRemoveZone = (id: string) => {
    if (!settingsForm) return;
    setSettingsForm({
      ...settingsForm,
      deliveryZones: settingsForm.deliveryZones.filter((z) => z.id !== id),
    });
  };

  if (!isOpen) return null;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const q = orderSearch.trim().toLowerCase();
    const matchSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q);
    return matchStatus && matchSearch;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchCat = productCategoryFilter === 'all' || p.categoryId === productCategoryFilter;
    const q = productSearch.trim().toLowerCase();
    const matchSearch =
      !q || p.nameAr.toLowerCase().includes(q) || (p.nameEn && p.nameEn.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-6xl bg-[#FFF8EF] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 bg-[#173D2B] text-white flex flex-wrap items-center justify-between gap-3 border-b border-[#D9A441]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D9A441] text-[#173D2B] flex items-center justify-center font-bold text-lg">
              ⚙️
            </div>
            <div>
              <h2 className="text-lg font-bold">لوحة إدارة المطعم الإيطالي</h2>
              <span className="text-xs text-[#FFF8EF]/80">
                Ramble Zone · قسم 15 مايو · تحكم فوري بالمنيو والطلبات والإعدادات
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل خروج</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="إغلاق لوحة التحكم"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-4 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'stats'
                ? 'border-[#173D2B] text-[#173D2B]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>نظرة عامة والمبيعات</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#173D2B] text-[#173D2B]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>الطلبات الواردة</span>
            {orders.filter((o) => o.status === 'new').length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C83B32] text-white text-[10px] flex items-center justify-center font-bold">
                {orders.filter((o) => o.status === 'new').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#173D2B] text-[#173D2B]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>إدارة الأصناف والمنيو ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'categories'
                ? 'border-[#173D2B] text-[#173D2B]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>التصنيفات ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#173D2B] text-[#173D2B]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>إعدادات المطعم والتوصيل</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: STATS & OVERVIEW */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <span className="text-xs text-gray-500 font-bold block mb-1">إجمالي المبيعات المحققة</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#173D2B]">
                      {stats?.totalRevenue || 0}
                    </span>
                    <span className="text-xs font-bold text-[#C83B32]">ج.م</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <span className="text-xs text-gray-500 font-bold block mb-1">مبيعات اليوم</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#C83B32]">
                      {stats?.todayRevenue || 0}
                    </span>
                    <span className="text-xs font-bold text-[#C83B32]">ج.م</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <span className="text-xs text-gray-500 font-bold block mb-1">إجمالي عدد الطلبات</span>
                  <span className="text-2xl font-black text-gray-800">
                    {stats?.totalOrders || 0}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <span className="text-xs text-gray-500 font-bold block mb-1">طلبات قيد المتابعة</span>
                  <span className="text-2xl font-black text-amber-600">
                    {stats?.pendingOrders || 0}
                  </span>
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#173D2B] flex items-center gap-2">
                  <span>الأطباق الأكثر طلباً ومبيعاً</span>
                  <span className="text-xs text-gray-400 font-normal">(مبني على إحصائيات الطلبات الفعلية)</span>
                </h3>

                {stats?.topSellingProducts && stats.topSellingProducts.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {stats.topSellingProducts.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#173D2B]/10 text-[#173D2B] font-bold flex items-center justify-center text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-gray-900">{item.nameAr}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-gray-600">
                            تم بيع: <strong className="text-gray-900">{item.count}</strong> وجبة
                          </span>
                          <span className="font-bold text-[#173D2B]">{item.revenue} ج.م</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 py-4">لا توجد بيانات مبيعات كافية حتى الآن.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGER */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="ابحث برقم الطلب، اسم العميل، الهاتف..."
                    className="w-full pr-4 pl-9 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#173D2B]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {[
                    { key: 'all', label: 'الكل' },
                    { key: 'new', label: 'جديد' },
                    { key: 'preparing', label: 'قيد التجهيز' },
                    { key: 'delivering', label: 'في الطريق' },
                    { key: 'delivered', label: 'تم التسليم' },
                    { key: 'cancelled', label: 'ملغي' },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setOrderStatusFilter(filter.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        orderStatusFilter === filter.key
                          ? 'bg-[#173D2B] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                {filteredOrders.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 text-xs">
                    لا توجد طلبات مطابقة لمعايير البحث.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                        <tr>
                          <th className="p-3.5">رقم الطلب</th>
                          <th className="p-3.5">العميل</th>
                          <th className="p-3.5">الهاتف</th>
                          <th className="p-3.5">النوع والمنطقة</th>
                          <th className="p-3.5">الإجمالي</th>
                          <th className="p-3.5">الحالة</th>
                          <th className="p-3.5">التاريخ والوقت</th>
                          <th className="p-3.5">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="p-3.5 font-mono font-bold text-[#173D2B]">
                              #{order.orderNumber}
                            </td>
                            <td className="p-3.5 font-bold text-gray-900">{order.customerName}</td>
                            <td className="p-3.5 font-mono" dir="ltr">
                              {order.customerPhone}
                            </td>
                            <td className="p-3.5">
                              <span className="block font-medium">
                                {order.deliveryType === 'delivery' ? '🛵 توصيل' : '🏪 تيك أواي'}
                              </span>
                              <span className="text-[10px] text-gray-500">{order.deliveryZoneName}</span>
                            </td>
                            <td className="p-3.5 font-black text-[#C83B32]">{order.total} ج.م</td>
                            <td className="p-3.5">
                              {order.status === 'new' && (
                                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">
                                  جديد
                                </span>
                              )}
                              {order.status === 'preparing' && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold text-[10px]">
                                  قيد التجهيز
                                </span>
                              )}
                              {order.status === 'delivering' && (
                                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold text-[10px]">
                                  في الطريق
                                </span>
                              )}
                              {order.status === 'delivered' && (
                                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold text-[10px]">
                                  تم التسليم
                                </span>
                              )}
                              {order.status === 'cancelled' && (
                                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold text-[10px]">
                                  ملغي
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-gray-500 text-[11px]">
                              {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="p-3.5">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="bg-[#173D2B] hover:bg-[#C83B32] text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                عرض وإدارة
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGER */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Product Controls Header */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="ابحث عن صنف..."
                      className="w-full pr-4 pl-8 py-2 rounded-xl border border-gray-200 text-xs"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                  </div>

                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="all">كل التصنيفات</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#173D2B] hover:bg-[#C83B32] text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D9A441]" />
                  <span>إضافة صنف إيطالي جديد</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                      <tr>
                        <th className="p-3.5">الصورة</th>
                        <th className="p-3.5">اسم الصنف</th>
                        <th className="p-3.5">التصنيف</th>
                        <th className="p-3.5">السعر الأساسي</th>
                        <th className="p-3.5">الحالة</th>
                        <th className="p-3.5">الأحجام والإضافات</th>
                        <th className="p-3.5">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((p) => {
                        const cat = categories.find((c) => c.id === p.categoryId);
                        return (
                          <tr key={p.id} className="hover:bg-gray-50/80">
                            <td className="p-3">
                              <img
                                src={p.image}
                                alt={p.nameAr}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                              />
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-gray-900">{p.nameAr}</div>
                              {p.nameEn && (
                                <span className="text-[10px] text-gray-400 font-sans" dir="ltr">
                                  {p.nameEn}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-gray-700">{cat?.nameAr || 'غير محدد'}</td>
                            <td className="p-3 font-black text-[#173D2B]">{p.price} ج.م</td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleProductAvailability(p)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all ${
                                  p.isAvailable
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                              >
                                {p.isAvailable ? 'متوفر للطلب ✓' : 'غير متوفر ✕'}
                              </button>
                            </td>
                            <td className="p-3 text-gray-500 text-[11px]">
                              {p.sizes?.length ? `${p.sizes.length} أحجام` : 'حجم قياسي'} ·{' '}
                              {p.extras?.length ? `${p.extras.length} إضافات` : 'بدون إضافات'}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedProduct(p);
                                    setIsProductModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#173D2B] hover:text-white text-gray-700 transition-colors cursor-pointer"
                                  title="تعديل الصنف"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.nameAr)}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                                  title="حذف الصنف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES MANAGER */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsCategoryModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-[#173D2B] hover:bg-[#C83B32] text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D9A441]" />
                  <span>إضافة تصنيف جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-gray-400 font-mono">ترتيب #{c.sortOrder}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {c.isActive ? 'مفعل' : 'معطل'}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#173D2B]">{c.nameAr}</h4>
                      {c.nameEn && <span className="text-xs text-gray-400 block">{c.nameEn}</span>}
                      <p className="text-xs text-gray-600 mt-2">{c.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(c);
                          setIsCategoryModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#173D2B] hover:text-white text-gray-700 cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id, c.nameAr)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RESTAURANT SETTINGS & ZONES */}
          {activeTab === 'settings' && settingsForm && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
              {feedbackMessage && (
                <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{feedbackMessage}</span>
                </div>
              )}

              {/* Commercial Name Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                  <SettingsIcon className="w-4 h-4 text-[#D9A441]" />
                  <h3 className="text-sm font-bold text-[#173D2B]">
                    الاسم التجاري وهوية المطعم (قابلة للتعديل بالكامل):
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      الاسم التجاري الرسمي للمطعم:
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.restaurantName}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, restaurantName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block">
                      سيظهر هذا الاسم في الترويسة، الرسائل، وفواتير الطلبات.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      الوصف التسويقي القصير (Slogan):
                    </label>
                    <input
                      type="text"
                      value={settingsForm.slogan}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, slogan: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B]"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Location Info */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                  <Phone className="w-4 h-4 text-[#D9A441]" />
                  <h3 className="text-sm font-bold text-[#173D2B]">أرقام التواصل والموقع الجغرافي:</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      رقم هاتف الاتصال:
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      رقم واتساب الرسمي لتلقي الطلبات:
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, whatsapp: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      العنوان الجغرافي للمطعم:
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, address: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      رابط خريطة Google Maps:
                    </label>
                    <input
                      type="url"
                      value={settingsForm.googleMapsUrl}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Working Hours & Policies */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                  <Clock className="w-4 h-4 text-[#D9A441]" />
                  <h3 className="text-sm font-bold text-[#173D2B]">مواعيد العمل وسياسة الطلبات:</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      نص مواعيد العمل الدقيقة:
                    </label>
                    <input
                      type="text"
                      value={settingsForm.workingHours}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, workingHours: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      الحد الأدنى لقيمة الطلب (بالجنيه EGP):
                    </label>
                    <input
                      type="number"
                      value={settingsForm.minOrderAmount}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          minOrderAmount: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Zones Configuration */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <button
                    type="button"
                    onClick={handleAddZone}
                    className="flex items-center gap-1 text-xs bg-[#173D2B] text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة منطقة توصيل جديدة</span>
                  </button>
                  <h3 className="text-sm font-bold text-[#173D2B]">
                    مناطق التوصيل ورسوم المشوار في 15 مايو:
                  </h3>
                </div>

                <div className="space-y-3">
                  {settingsForm.deliveryZones.map((zone, idx) => (
                    <div
                      key={zone.id}
                      className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveZone(zone.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                        title="حذف المنطقة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex-1 min-w-[200px]">
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) => {
                            const updated = [...settingsForm.deliveryZones];
                            updated[idx].name = e.target.value;
                            setSettingsForm({ ...settingsForm, deliveryZones: updated });
                          }}
                          placeholder="اسم المنطقة (مثال: مجاورات 15 مايو)"
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                        />
                      </div>

                      <div className="w-28">
                        <input
                          type="number"
                          value={zone.fee}
                          onChange={(e) => {
                            const updated = [...settingsForm.deliveryZones];
                            updated[idx].fee = Number(e.target.value);
                            setSettingsForm({ ...settingsForm, deliveryZones: updated });
                          }}
                          placeholder="الرسوم (ج.م)"
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs text-center bg-white"
                          dir="ltr"
                        />
                      </div>

                      <div className="w-36">
                        <input
                          type="text"
                          value={zone.estimatedTime}
                          onChange={(e) => {
                            const updated = [...settingsForm.deliveryZones];
                            updated[idx].estimatedTime = e.target.value;
                            setSettingsForm({ ...settingsForm, deliveryZones: updated });
                          }}
                          placeholder="الوقت المقدر (مثال: 30 دقيقة)"
                          className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="flex items-center gap-2 bg-[#173D2B] hover:bg-[#C83B32] disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all cursor-pointer text-sm"
                >
                  <Save className="w-4 h-4 text-[#D9A441]" />
                  <span>{savingSettings ? 'جاري الحفظ...' : 'حفظ كافة التعديلات والإعدادات'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Nested Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        product={selectedProduct}
        categories={categories}
        onClose={() => setIsProductModalOpen(false)}
        onSaved={loadAllData}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        category={selectedCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        onSaved={loadAllData}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusUpdated={loadAllData}
      />
    </div>
  );
};
