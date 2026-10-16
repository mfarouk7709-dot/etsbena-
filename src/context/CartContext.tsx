import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductSize, ProductExtra, DeliveryZone, RestaurantSettings } from '../types/restaurant';

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    selectedSize?: ProductSize,
    selectedExtras?: ProductExtra[],
    quantity?: number,
    specialNotes?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  setQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalItemsCount: number;
  selectedZone: DeliveryZone | null;
  setSelectedZone: (zone: DeliveryZone | null) => void;
  deliveryType: 'delivery' | 'pickup';
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  settings: RestaurantSettings | null;
  setSettings: (settings: RestaurantSettings) => void;
  refreshSettings: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'itl_restaurant_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    return [];
  });

  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items]);

  // Load settings on startup
  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data: RestaurantSettings = await res.json();
        setSettings(data);
        if (!selectedZone && data.deliveryZones && data.deliveryZones.length > 0) {
          setSelectedZone(data.deliveryZones[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings in cart context', err);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const addItem = (
    product: Product,
    selectedSize?: ProductSize,
    selectedExtras: ProductExtra[] = [],
    quantity: number = 1,
    specialNotes: string = ''
  ) => {
    if (!product.isAvailable) return;

    const qty = Math.max(1, Math.floor(quantity));
    const extraIds = selectedExtras.map((e) => e.id).sort().join('_');
    const sizeId = selectedSize ? selectedSize.id : 'default';
    const cartItemId = `${product.id}-${sizeId}-${extraIds}-${specialNotes.trim()}`;

    // Calculate unit price
    let unitPrice = product.price;
    if (selectedSize) {
      unitPrice = selectedSize.price;
    }
    for (const extra of selectedExtras) {
      unitPrice += extra.price;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          productId: product.id,
          product,
          selectedSize,
          selectedExtras,
          unitPrice,
          quantity: qty,
          specialNotes: specialNotes.trim() || undefined,
        };
        return [...prevItems, newItem];
      }
    });

    // Auto-open cart briefly to acknowledge
    setIsCartOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const setQuantity = (cartItemId: string, quantity: number) => {
    const validQty = Math.max(1, Math.floor(quantity));
    setItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: validQty } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = deliveryType === 'delivery' ? (selectedZone ? selectedZone.fee : 20) : 0;
  const total = subtotal + deliveryFee;
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        setQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        totalItemsCount,
        selectedZone,
        setSelectedZone,
        deliveryType,
        setDeliveryType,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        selectedProductForModal,
        setSelectedProductForModal,
        settings,
        setSettings,
        refreshSettings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
