import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Admin authentication middleware
const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'غير مصرح: يلزم إدخال رمز الدخول للوحة الإدارة' });
    return;
  }
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!db.isValidToken(token)) {
    res.status(403).json({ error: 'رمز الدخول غير صالح أو منتهي الصلاحية' });
    return;
  }
  next();
};

// ---------------- API ROUTES ----------------

// Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    // Do not expose adminPasswordHash to public
    const { adminPasswordHash, ...safeSettings } = settings;
    res.json(safeSettings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    const { adminPasswordHash, ...safeSettings } = updated;
    res.json({ success: true, settings: safeSettings });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Auth
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ error: 'يرجى كتابة كلمة مرور المدير' });
      return;
    }
    const result = db.verifyAdmin(password);
    if (result.success && result.token) {
      res.json({ success: true, token: result.token });
    } else {
      res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ valid: false });
    return;
  }
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  res.json({ valid: db.isValidToken(token) });
});

// Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  try {
    const categories = db.getCategories(true);
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/categories', requireAdmin, (_req: Request, res: Response) => {
  try {
    const categories = db.getCategories(false);
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
  try {
    const newCat = db.addCategory(req.body);
    res.status(201).json(newCat);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'التصنيف غير موجود' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const deleted = db.deleteCategory(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'التصنيف غير موجود' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  try {
    const categoryId = req.query.category as string | undefined;
    const featured = req.query.featured === 'true' ? true : undefined;
    const products = db.getProducts({
      categoryId: categoryId || undefined,
      isFeatured: featured,
    });
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'الصنف غير موجود' });
      return;
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const newProduct = db.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'الصنف غير موجود' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'الصنف غير موجود' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Orders
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      deliveryType,
      deliveryAddress,
      deliveryZoneId,
      orderNotes,
      paymentMethod,
      items,
    } = req.body;

    if (!customerName || !customerName.trim()) {
      res.status(400).json({ error: 'يرجى إدخال اسم العميل' });
      return;
    }
    if (!customerPhone || !customerPhone.trim()) {
      res.status(400).json({ error: 'يرجى إدخال رقم هاتف للتواصل' });
      return;
    }
    if (deliveryType === 'delivery' && (!deliveryAddress || !deliveryAddress.trim())) {
      res.status(400).json({ error: 'يرجى كتابة عنوان التوصيل بالتفصيل' });
      return;
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'السلة فارغة. يرجى اختيار وجبة واحدة على الأقل' });
      return;
    }

    const { order, whatsappText } = db.createOrder({
      customerName,
      customerPhone,
      deliveryType: deliveryType || 'delivery',
      deliveryAddress: deliveryAddress || '',
      deliveryZoneId: deliveryZoneId || '',
      orderNotes,
      paymentMethod: paymentMethod || 'cash',
      items,
    });

    const settings = db.getSettings();
    const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone;
    const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(whatsappText)}`;

    res.status(201).json({
      success: true,
      order,
      whatsappText,
      whatsappUrl,
      message: 'تم تسجيل طلبك بنجاح وحفظه في النظام برقم ' + order.orderNumber,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'حدث خطأ أثناء معالجة الطلب' });
  }
});

app.get('/api/orders/track/:query', (req: Request, res: Response) => {
  try {
    const order = db.getOrderByIdOrNumber(req.params.query);
    if (!order) {
      res.status(404).json({ error: 'لم يتم العثور على طلب بهذا الرقم أو رقم الهاتف' });
      return;
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Orders & Dashboard
app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const orders = db.getOrders({ status, search });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: 'يرجى تحديد الحالة الجديدة' });
      return;
    }
    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ error: 'الطلب غير موجود' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  try {
    const stats = db.getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- VITE / STATIC INTEGRATION ----------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Italian Restaurant Server is listening at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
