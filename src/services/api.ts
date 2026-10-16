import {
  Category,
  Product,
  Order,
  RestaurantSettings,
  DashboardStats,
} from '../types/restaurant';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('itl_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Settings
  async getSettings(): Promise<RestaurantSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('فشل جلب إعدادات المطعم');
    return res.json();
  },

  async updateSettings(settings: Partial<RestaurantSettings>): Promise<{ success: boolean; settings: RestaurantSettings }> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(settings),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل تحديث الإعدادات');
    }
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('فشل جلب التصنيفات');
    return res.json();
  },

  async getAdminCategories(): Promise<Category[]> {
    const res = await fetch('/api/admin/categories', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل جلب تصنيفات الإدارة');
    return res.json();
  },

  async createCategory(cat: Omit<Category, 'id'>): Promise<Category> {
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(cat),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل إضافة التصنيف');
    }
    return res.json();
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل تعديل التصنيف');
    }
    return res.json();
  },

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل حذف التصنيف');
  },

  // Products
  async getProducts(params?: { category?: string; featured?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.featured) query.append('featured', 'true');
    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error('فشل جلب الأصناف');
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('فشل جلب تفاصيل الصنف');
    return res.json();
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل إضافة الصنف');
    }
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل تعديل الصنف');
    }
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل حذف الصنف');
  },

  // Orders
  async submitOrder(payload: {
    customerName: string;
    customerPhone: string;
    deliveryType: 'delivery' | 'pickup';
    deliveryAddress: string;
    deliveryZoneId: string;
    orderNotes?: string;
    paymentMethod: 'cash' | 'card_pos';
    items: {
      productId: string;
      selectedSizeId?: string;
      selectedExtraIds?: string[];
      quantity: number;
      specialNotes?: string;
    }[];
  }): Promise<{ success: boolean; order: Order; whatsappText: string; whatsappUrl: string; message: string }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل إرسال الطلب');
    }
    return res.json();
  },

  async trackOrder(query: string): Promise<Order> {
    const res = await fetch(`/api/orders/track/${encodeURIComponent(query)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'لم يتم العثور على الطلب');
    }
    return res.json();
  },

  // Admin Orders & Analytics
  async getAdminOrders(params?: { status?: string; search?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`/api/admin/orders?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل جلب الطلبات للإدارة');
    return res.json();
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const res = await fetch(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل تعديل حالة الطلب');
    }
    return res.json();
  },

  async getAdminStats(): Promise<DashboardStats> {
    const res = await fetch('/api/admin/stats', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('فشل جلب إحصائيات المطعم');
    return res.json();
  },

  // Admin Login
  async adminLogin(password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'كلمة المرور غير صحيحة');
    }
    return res.json();
  },

  async verifyAdminToken(): Promise<boolean> {
    const token = localStorage.getItem('itl_admin_token');
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return false;
      const data = await res.json();
      return !!data.valid;
    } catch {
      return false;
    }
  },
};
