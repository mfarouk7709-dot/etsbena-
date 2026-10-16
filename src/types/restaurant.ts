export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductSize {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  isDefault?: boolean;
}

export interface ProductExtra {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
}

export interface Product {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  description: string;
  price: number; // Base price in EGP
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  sizes: ProductSize[];
  extras: ProductExtra[];
  preparationTime?: string;
  calories?: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  product: Product;
  selectedSize?: ProductSize;
  selectedExtras: ProductExtra[];
  unitPrice: number;
  quantity: number;
  specialNotes?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string;
}

export type OrderStatus = 'new' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderItemSummary {
  productId: string;
  nameAr: string;
  nameEn?: string;
  sizeName?: string;
  extras: string[];
  unitPrice: number;
  quantity: number;
  subtotal: number;
  specialNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress: string;
  deliveryZoneId: string;
  deliveryZoneName: string;
  orderNotes?: string;
  paymentMethod: 'cash' | 'card_pos';
  status: OrderStatus;
  items: OrderItemSummary[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantSettings {
  restaurantName: string;
  nameNotice?: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  area: string;
  googleMapsUrl: string;
  workingHours: string;
  workingDays: string;
  currency: string;
  minOrderAmount: number;
  isAcceptingOrders: boolean;
  deliveryZones: DeliveryZone[];
  socialFacebook: string;
  socialInstagram: string;
  adminPasswordHash?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  topSellingProducts: {
    productId: string;
    nameAr: string;
    count: number;
    revenue: number;
  }[];
}
