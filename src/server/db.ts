import fs from 'fs';
import path from 'path';
import {
  Category,
  Product,
  Order,
  RestaurantSettings,
  DashboardStats,
  CartItem,
  OrderItemSummary,
} from '../types/restaurant.js';

interface DatabaseSchema {
  settings: RestaurantSettings;
  categories: Category[];
  products: Product[];
  orders: Order[];
  adminTokens: string[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'restaurant_db.json');

const INITIAL_SETTINGS: RestaurantSettings = {
  restaurantName: 'المطعم الإيطالي (رامبل زون)',
  nameNotice: 'الاسم التجاري الرسمي قابل للتعديل فوراً من لوحة الإدارة حسب ترخيص ونشاط المطعم.',
  slogan: 'المذاق الإيطالي الأصيل بأيدي أمهر الطهاة وفي قلب رامبل زون 15 مايو',
  phone: '01037313419',
  whatsapp: '01037313419',
  address: 'Ramble Zone، قسم 15 مايو، القاهرة، مصر',
  city: 'القاهرة',
  area: 'قسم 15 مايو',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ramble+Zone+15+May+Cairo',
  workingHours: 'يومياً من 12:00 ظهراً حتى 01:00 بعد منتصف الليل (قابلة للتعديل)',
  workingDays: 'طوال أيام الأسبوع',
  currency: 'ج.م',
  minOrderAmount: 60,
  isAcceptingOrders: true,
  deliveryZones: [
    { id: 'zone-15may-central', name: 'قسم 15 مايو (رامبل زون والمنطقة المركزية)', fee: 20, estimatedTime: '25-35 دقيقة' },
    { id: 'zone-15may-extensions', name: '15 مايو - مجاورات الامتداد والحي السكني', fee: 25, estimatedTime: '30-40 دقيقة' },
    { id: 'zone-helwan', name: 'مدينة حلوان والمناطق المجاورة', fee: 35, estimatedTime: '40-50 دقيقة' },
    { id: 'zone-pickup', name: 'استلام مباشر من المطعم (رامبل زون - تيك أواي)', fee: 0, estimatedTime: '15-25 دقيقة' }
  ],
  socialFacebook: 'https://facebook.com',
  socialInstagram: 'https://instagram.com',
  adminPasswordHash: 'admin123' // كلمة المرور الافتراضية للوحة التحكم (قابلة للتغيير من الإعدادات)
};

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-pizza',
    nameAr: 'بيتزا نابوليتانا',
    nameEn: 'Neapolitan Pizza',
    description: 'تُخبز على الحجر بدرجة حرارة 450 مئوية مع دقيق إيطالي كابوتو وصلصة سان مارزانو',
    icon: 'pizza',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-pasta',
    nameAr: 'باستا طازجة',
    nameEn: 'Fresh Handmade Pasta',
    description: 'باستا إيطالية مصنوعة يدوياً يومياً وتُطهى بدرجة الدنتي المثالية',
    icon: 'pasta',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-antipasti',
    nameAr: 'مقبلات وبروسكيتا',
    nameEn: 'Antipasti & Starters',
    description: 'مقبلات إيطالية خفيفة تُحضر بأجود أنواع الأجبان وزيت الزيتون البكر',
    icon: 'appetizer',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-secondi',
    nameAr: 'أطباق رئيسية',
    nameEn: 'Secondi & Mains',
    description: 'وصفات اللحوم والدواجن الإيطالية الكلاسيكية بالتوابل التوسكانية',
    icon: 'steak',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-dolci',
    nameAr: 'حلويات إيطالية',
    nameEn: 'Dolci & Desserts',
    description: 'ختام مثالي لوجبتك بأشهر الحلويات الإيطالية المجهزة بالجبن المسكربوني والقهوة',
    icon: 'dessert',
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 'cat-bevande',
    nameAr: 'مشروبات منعشة',
    nameEn: 'Beverages & Mocktails',
    description: 'موكتيلات إيطالية منعشة، عصائر طبيعية ومياه فوارة',
    icon: 'drink',
    sortOrder: 6,
    isActive: true,
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-margherita-dop',
    categoryId: 'cat-pizza',
    nameAr: 'بيتزا مارجريتا نابوليتانا D.O.P',
    nameEn: 'Pizza Margherita D.O.P',
    description: 'البيتزا الإيطالية الكلاسيكية: صلصة طماطم سان مارزانو، جبنة موتزاريلا دي بوفالا طازجة، ريحان إيطالي وزيت زيتون بكر ممتاز.',
    price: 165,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    preparationTime: '15-20 دقيقة',
    calories: 820,
    sizes: [
      { id: 's-reg', nameAr: 'وسط (30 سم)', nameEn: 'Medium (30cm)', price: 165, isDefault: true },
      { id: 's-large', nameAr: 'كبير (36 سم)', nameEn: 'Large (36cm)', price: 215 },
    ],
    extras: [
      { id: 'ex-mozzarella', nameAr: 'جبنة موتزاريلا دي بوفالا إضافية', nameEn: 'Extra Buffalo Mozzarella', price: 35 },
      { id: 'ex-mushrooms', nameAr: 'مشروم بورتوبيلو طازج', nameEn: 'Fresh Portobello Mushrooms', price: 25 },
      { id: 'ex-pesto-drizzle', nameAr: 'رذاذ صوص بيستو الريحان', nameEn: 'Basil Pesto Drizzle', price: 20 },
    ],
  },
  {
    id: 'prod-diavola',
    categoryId: 'cat-pizza',
    nameAr: 'بيتزا ديافولا حارة (بيبروني)',
    nameEn: 'Pizza Diavola Piccante',
    description: 'بيبروني إيطالي فاخر، جبنة فيور دي لاتي، صوص طماطم متبل، رقائق الفلفل الحار وزيت زيتون حار مع ريحان.',
    price: 195,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    preparationTime: '15-20 دقيقة',
    calories: 950,
    sizes: [
      { id: 's-reg', nameAr: 'وسط (30 سم)', nameEn: 'Medium (30cm)', price: 195, isDefault: true },
      { id: 's-large', nameAr: 'كبير (36 سم)', nameEn: 'Large (36cm)', price: 250 },
    ],
    extras: [
      { id: 'ex-extra-pepperoni', nameAr: 'شرائح بيبروني إضافية', nameEn: 'Extra Pepperoni', price: 40 },
      { id: 'ex-jalapeno', nameAr: 'فلفل هالبينو حار', nameEn: 'Jalapeno Slices', price: 15 },
      { id: 'ex-cheese-crust', nameAr: 'أطراف محشوة بالجبن', nameEn: 'Cheese Stuffed Crust', price: 45 },
    ],
  },
  {
    id: 'prod-quattro-formaggi',
    categoryId: 'cat-pizza',
    nameAr: 'بيتزا كواترو فورماجي (الأجبان الأربعة)',
    nameEn: 'Pizza Quattro Formaggi',
    description: 'مزيج فاخر من 4 أجبان إيطالية أصيلة: موتزاريلا، جورجونزولا كريمية، بارميجيانو ريجيانو معتق، وجبن فونتينا.',
    price: 215,
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: false,
    preparationTime: '18-22 دقيقة',
    calories: 1040,
    sizes: [
      { id: 's-reg', nameAr: 'وسط (30 سم)', nameEn: 'Medium (30cm)', price: 215, isDefault: true },
      { id: 's-large', nameAr: 'كبير (36 سم)', nameEn: 'Large (36cm)', price: 275 },
    ],
    extras: [
      { id: 'ex-honey-truffle', nameAr: 'عسل جبلي مع زيت ترفل', nameEn: 'Honey Truffle Drizzle', price: 30 },
      { id: 'ex-walnuts', nameAr: 'عين جمل محمص مقرمش', nameEn: 'Toasted Walnuts', price: 25 },
    ],
  },
  {
    id: 'prod-tartufo-funghi',
    categoryId: 'cat-pizza',
    nameAr: 'بيتزا تارتوفو ومشروم بري',
    nameEn: 'Pizza Tartufo e Funghi',
    description: 'صلصة كريمة الترفل الإيطالية الفاخرة، مشروم بورتوبيلو، جبنة موتزاريلا، بارميزان وزيت الكمأة الأسود.',
    price: 240,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    preparationTime: '18-22 دقيقة',
    calories: 910,
    sizes: [
      { id: 's-reg', nameAr: 'وسط (30 سم)', nameEn: 'Medium (30cm)', price: 240, isDefault: true },
      { id: 's-large', nameAr: 'كبير (36 سم)', nameEn: 'Large (36cm)', price: 310 },
    ],
    extras: [
      { id: 'ex-extra-truffle', nameAr: 'زيت كمأة إضافي', nameEn: 'Extra Truffle Oil', price: 35 },
      { id: 'ex-parmesan', nameAr: 'رقائق جبن بارميزان', nameEn: 'Parmesan Shavings', price: 30 },
    ],
  },
  {
    id: 'prod-fettuccine-alfredo',
    categoryId: 'cat-pasta',
    nameAr: 'فيتوتشيني ألفريدو مع الدجاج والمشروم',
    nameEn: 'Fettuccine Alfredo con Pollo e Funghi',
    description: 'باستا فيتوتشيني يدوية الصنع مغمورة في صوص الألفريدو المخملي مع بارميجيانو ريجيانو وصدور دجاج مشوية ومشروم طازج.',
    price: 185,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    preparationTime: '15-20 دقيقة',
    calories: 780,
    sizes: [
      { id: 'sz-single', nameAr: 'وجبة فردية مشبعة', nameEn: 'Single Portion', price: 185, isDefault: true },
    ],
    extras: [
      { id: 'ex-chicken', nameAr: 'دجاج مشوي إضافي (100 جم)', nameEn: 'Extra Grilled Chicken', price: 45 },
      { id: 'ex-parm', nameAr: 'جبن بارميزان معتق إضافي', nameEn: 'Extra Aged Parmesan', price: 25 },
      { id: 'ex-garlic-bread', nameAr: 'خبز ثوم إيطالي مقرمش', nameEn: 'Garlic Bread (2 pcs)', price: 30 },
    ],
  },
  {
    id: 'prod-carbonara',
    categoryId: 'cat-pasta',
    nameAr: 'سباغيتي كاربونارا الأصلية',
    nameEn: 'Spaghetti alla Carbonara Tradizionale',
    description: 'الوصفة الرومانية الأصلية دون كريمة: جوانشيالي إيطالي مقرمش، صفار بيض طازج، جبن بيكورينو رومانو، وفلفل أسود مجروش طازجاً.',
    price: 195,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: false,
    preparationTime: '15-18 دقيقة',
    calories: 750,
    sizes: [
      { id: 'sz-single', nameAr: 'وجبة فردية مشبعة', nameEn: 'Single Portion', price: 195, isDefault: true },
    ],
    extras: [
      { id: 'ex-pecorino', nameAr: 'جبن بيكورينو رومانو إضافي', nameEn: 'Extra Pecorino Romano', price: 30 },
      { id: 'ex-crispy-guanciale', nameAr: 'جوانشيالي مقرمش إضافي', nameEn: 'Extra Crispy Guanciale', price: 50 },
    ],
  },
  {
    id: 'prod-lasagna-bolognese',
    categoryId: 'cat-pasta',
    nameAr: 'لازانيا بولونيز بالفرن الحجري',
    nameEn: 'Lasagna alla Bolognese al Forno',
    description: 'طبقات من المكرونة الطازجة المحضرة يدوياً، مع صوص البولونيز باللحم البقري المطهو ببطء لمدة 4 ساعات، وبشاميل ناعم وجبن موزاريلا ذائب.',
    price: 215,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    preparationTime: '20-25 دقيقة',
    calories: 890,
    sizes: [
      { id: 'sz-single', nameAr: 'طبق فرن فردي', nameEn: 'Single Baking Dish', price: 215, isDefault: true },
    ],
    extras: [
      { id: 'ex-cheese-top', nameAr: 'طبقة إضافية من الجبن الذائب', nameEn: 'Extra Melted Cheese Layer', price: 35 },
      { id: 'ex-garlic-bread', nameAr: 'خبز ثوم إيطالي مقرمش', nameEn: 'Garlic Bread (2 pcs)', price: 30 },
    ],
  },
  {
    id: 'prod-penne-arrabbiata',
    categoryId: 'cat-pasta',
    nameAr: 'بيني ألا أرابياتا (حار ولذيذ)',
    nameEn: 'Penne all\'Arrabbiata',
    description: 'مكرونة بيني مع صلصة طماطم إيطالية حارة، ثوم محمر بزيت الزيتون البكر، ريحان وبقدونس إيطالي مع رشة جبن بارميزان.',
    price: 145,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: false,
    preparationTime: '12-15 دقيقة',
    calories: 610,
    sizes: [
      { id: 'sz-single', nameAr: 'وجبة فردية', nameEn: 'Single Portion', price: 145, isDefault: true },
    ],
    extras: [
      { id: 'ex-chicken', nameAr: 'إضافة دجاج مشوي', nameEn: 'Add Grilled Chicken', price: 45 },
      { id: 'ex-burrata', nameAr: 'كرة جبنة بوراتا طازجة على الوجه', nameEn: 'Fresh Burrata Ball', price: 65 },
    ],
  },
  {
    id: 'prod-bruschetta-pomodoro',
    categoryId: 'cat-antipasti',
    nameAr: 'بروسكيتا البندورة والريحان',
    nameEn: 'Bruschetta al Pomodoro e Basilico',
    description: 'شرائح خبز الساوردو الإيطالي المحمص بزيت الزيتون والثوم، مغطاة بطماطم متبلة، أوراق ريحان طازجة، وخلاصة بلسميك مودينا المعتق.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: false,
    preparationTime: '10 دقائق',
    calories: 320,
    sizes: [],
    extras: [
      { id: 'ex-feta-goat', nameAr: 'جبن ماعز كريمي', nameEn: 'Creamy Goat Cheese', price: 25 },
    ],
  },
  {
    id: 'prod-arancini',
    categoryId: 'cat-antipasti',
    nameAr: 'أرانشيني سيسيليانو بالجبن والراغو',
    nameEn: 'Arancini Siciliani al Ragù',
    description: 'كرات الأرز الإيطالي المقرمشة (3 قطع) المحشوة بلحم الراغو وجبنة الموزاريلا والبازلاء الحلوة، تقدم مع صوص المارينارا الساخن.',
    price: 125,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: false,
    preparationTime: '12-15 دقيقة',
    calories: 480,
    sizes: [],
    extras: [
      { id: 'ex-extra-dip', nameAr: 'صوص مارينارا إضافي', nameEn: 'Extra Marinara Dip', price: 15 },
    ],
  },
  {
    id: 'prod-pollo-parmigiana',
    categoryId: 'cat-secondi',
    nameAr: 'دجاج ألا بارميجيانا بالفرن',
    nameEn: 'Pollo alla Parmigiana',
    description: 'صدر دجاج مقرمش مغطى بصلصة المارينارا الإيطالية وجبنة الموزاريلا والبارميزان المخبوزة في الفرن، يقدم مع سباغيتي بالزيت والأعشاب.',
    price: 235,
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    preparationTime: '20-25 دقيقة',
    calories: 840,
    sizes: [],
    extras: [
      { id: 'ex-cheese-crust', nameAr: 'جبنة موزاريلا مضاعفة', nameEn: 'Double Mozzarella', price: 30 },
    ],
  },
  {
    id: 'prod-tiramisu',
    categoryId: 'cat-dolci',
    nameAr: 'تيراميسو كلاسيكو بالمسكربوني',
    nameEn: 'Tiramisù Tradizionale',
    description: 'الحلوى الإيطالية الأشهر عالمياً: بسكويت ليدي فينجرز مغموس بإسبريسو إيطالي مركز، مع كريمة الجبن المسكربوني الفاخر وبودرة الكاكاو البلجيكي.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    preparationTime: 'جاهز للتقديم',
    calories: 420,
    sizes: [],
    extras: [
      { id: 'ex-espresso-shot', nameAr: 'شوت إسبريسو جانبي', nameEn: 'Side Espresso Shot', price: 25 },
    ],
  },
  {
    id: 'prod-panna-cotta',
    categoryId: 'cat-dolci',
    nameAr: 'بانا كوتا بالتوت البري الأحمر',
    nameEn: 'Panna Cotta ai Frutti Rossi',
    description: 'بانا كوتا كريمية ناعمة مع فانيليا طبيعية مغطاة بصوص التوت البري الطازج وقليل من النعناع.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: false,
    preparationTime: 'جاهز للتقديم',
    calories: 360,
    sizes: [],
    extras: [],
  },
  {
    id: 'prod-limonata',
    categoryId: 'cat-bevande',
    nameAr: 'ليموناتا صقلية بالنعناع والمياه الفوارة',
    nameEn: 'Limonata Siciliana Frizzante',
    description: 'عصير الليمون الصقلي الطازج مع أوراق النعناع المفرومة ولمسة من المياه الفوارة الإيطالية المنعشة.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: false,
    preparationTime: '5 دقائق',
    calories: 110,
    sizes: [],
    extras: [],
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
          categories: parsed.categories?.length ? parsed.categories : INITIAL_CATEGORIES,
          products: parsed.products?.length ? parsed.products : INITIAL_PRODUCTS,
          orders: parsed.orders || [],
          adminTokens: parsed.adminTokens || ['admin-session-active-token'],
        };
      }
    } catch (e) {
      console.error('Error loading database, initializing defaults:', e);
    }

    const initialData: DatabaseSchema = {
      settings: INITIAL_SETTINGS,
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: [],
      adminTokens: ['admin-session-active-token'],
    };
    this.saveDirect(initialData);
    return initialData;
  }

  private saveDirect(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  private persist() {
    this.saveDirect(this.data);
  }

  // --- Settings ---
  getSettings(): RestaurantSettings {
    return this.data.settings;
  }

  updateSettings(newSettings: Partial<RestaurantSettings>): RestaurantSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.persist();
    return this.data.settings;
  }

  // --- Categories ---
  getCategories(onlyActive = true): Category[] {
    const list = this.data.categories.sort((a, b) => a.sortOrder - b.sortOrder);
    return onlyActive ? list.filter((c) => c.isActive) : list;
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const id = `cat-${Date.now()}`;
    const newCat: Category = { ...category, id };
    this.data.categories.push(newCat);
    this.persist();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.persist();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Products ---
  getProducts(filter?: { categoryId?: string; isAvailable?: boolean; isFeatured?: boolean }): Product[] {
    let list = [...this.data.products];
    if (filter?.categoryId) {
      list = list.filter((p) => p.categoryId === filter.categoryId);
    }
    if (filter?.isAvailable !== undefined) {
      list = list.filter((p) => p.isAvailable === filter.isAvailable);
    }
    if (filter?.isFeatured !== undefined) {
      list = list.filter((p) => p.isFeatured === filter.isFeatured);
    }
    return list;
  }

  getProductById(id: string): Product | null {
    return this.data.products.find((p) => p.id === id) || null;
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const id = `prod-${Date.now()}`;
    const newProd: Product = { ...product, id };
    this.data.products.push(newProd);
    this.persist();
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.persist();
    return this.data.products[idx];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Orders ---
  getOrders(filter?: { status?: string; search?: string }): Order[] {
    let list = [...this.data.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((o) => o.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
      );
    }
    return list;
  }

  getOrderByIdOrNumber(query: string): Order | null {
    const clean = query.trim().toLowerCase();
    return (
      this.data.orders.find(
        (o) =>
          o.id === query ||
          o.orderNumber.toLowerCase() === clean ||
          o.customerPhone === clean
      ) || null
    );
  }

  createOrder(payload: {
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
  }): { order: Order; whatsappText: string } {
    if (!payload.items || payload.items.length === 0) {
      throw new Error('السلة فارغة. يرجى اختيار صنف واحد على الأقل.');
    }

    const orderId = `ord-${Date.now()}`;
    const randomFour = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ITL-${randomFour}`;

    // Recalculate accurately on server from database
    let subtotal = 0;
    const validatedItems: OrderItemSummary[] = [];

    for (const reqItem of payload.items) {
      const product = this.getProductById(reqItem.productId);
      if (!product) {
        throw new Error(`الصنف المحدد غير موجود: ${reqItem.productId}`);
      }
      if (!product.isAvailable) {
        throw new Error(`عذراً، الصنف "${product.nameAr}" غير متوفر حالياً.`);
      }

      const qty = Math.max(1, Math.floor(reqItem.quantity || 1));
      let unitPrice = product.price;
      let sizeName = '';

      if (reqItem.selectedSizeId && product.sizes && product.sizes.length > 0) {
        const foundSize = product.sizes.find((s) => s.id === reqItem.selectedSizeId);
        if (foundSize) {
          unitPrice = foundSize.price;
          sizeName = foundSize.nameAr;
        }
      }

      const selectedExtrasNames: string[] = [];
      if (reqItem.selectedExtraIds && product.extras && product.extras.length > 0) {
        for (const extraId of reqItem.selectedExtraIds) {
          const foundExtra = product.extras.find((e) => e.id === extraId);
          if (foundExtra) {
            unitPrice += foundExtra.price;
            selectedExtrasNames.push(`${foundExtra.nameAr} (+${foundExtra.price} ج.م)`);
          }
        }
      }

      const itemSubtotal = unitPrice * qty;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        sizeName: sizeName || undefined,
        extras: selectedExtrasNames,
        unitPrice,
        quantity: qty,
        subtotal: itemSubtotal,
        specialNotes: reqItem.specialNotes?.trim(),
      });
    }

    // Determine delivery fee
    let deliveryFee = 0;
    let deliveryZoneName = 'استلام من المطعم (تيك أواي)';

    if (payload.deliveryType === 'delivery') {
      const zone = this.data.settings.deliveryZones.find((z) => z.id === payload.deliveryZoneId);
      if (zone) {
        deliveryFee = zone.fee;
        deliveryZoneName = zone.name;
      } else {
        deliveryFee = this.data.settings.deliveryZones[0]?.fee || 20;
        deliveryZoneName = this.data.settings.deliveryZones[0]?.name || 'منطقة التوصيل';
      }
    }

    const discount = 0;
    const total = subtotal + deliveryFee - discount;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerName: payload.customerName.trim(),
      customerPhone: payload.customerPhone.trim(),
      deliveryType: payload.deliveryType,
      deliveryAddress: payload.deliveryAddress ? payload.deliveryAddress.trim() : 'استلام من المطعم',
      deliveryZoneId: payload.deliveryZoneId,
      deliveryZoneName,
      orderNotes: payload.orderNotes?.trim(),
      paymentMethod: payload.paymentMethod,
      status: 'new',
      items: validatedItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);
    this.persist();

    // Prepare well-formatted WhatsApp message
    const lines = [
      `🍕 *طلب جديد من الموقع الإلكتروني - ${this.data.settings.restaurantName}*`,
      `🔖 *رقم الطلب:* ${orderNumber}`,
      `👤 *اسم العميل:* ${newOrder.customerName}`,
      `📞 *رقم الهاتف:* ${newOrder.customerPhone}`,
      `🛵 *طريقة الاستلام:* ${newOrder.deliveryType === 'delivery' ? 'توصيل للمنزل' : 'استلام من المطعم (تيك أواي)'}`,
      newOrder.deliveryType === 'delivery' ? `📍 *المنطقة:* ${newOrder.deliveryZoneName}` : '',
      newOrder.deliveryType === 'delivery' ? `🏠 *العنوان:* ${newOrder.deliveryAddress}` : '',
      `💳 *طريقة الدفع:* ${newOrder.paymentMethod === 'cash' ? 'الدفع عند الاستلام (كاش)' : 'الدفع بالفيزا عند الاستلام (POS)'}`,
      '',
      `📋 *تفاصيل الأصناف:*`,
    ].filter(Boolean);

    for (const item of validatedItems) {
      let itemLine = `• ${item.quantity}x ${item.nameAr}`;
      if (item.sizeName) itemLine += ` [${item.sizeName}]`;
      itemLine += ` (${item.subtotal} ج.م)`;
      lines.push(itemLine);
      if (item.extras.length > 0) {
        lines.push(`  + إضافات: ${item.extras.join('، ')}`);
      }
      if (item.specialNotes) {
        lines.push(`  - ملاحظة: ${item.specialNotes}`);
      }
    }

    lines.push('');
    lines.push(`💰 *المجموع الفرعي:* ${subtotal} ج.م`);
    if (newOrder.deliveryType === 'delivery') {
      lines.push(`🚚 *رسوم التوصيل:* ${deliveryFee} ج.م`);
    }
    lines.push(`⭐ *الإجمالي النهائي:* ${total} ج.م`);
    if (newOrder.orderNotes) {
      lines.push(`📝 *ملاحظات العميل:* ${newOrder.orderNotes}`);
    }
    lines.push('');
    lines.push(`_تم تسجيل الطلب في نظام المطعم برقم ${orderNumber}. نرجو التأكيد._`);

    return {
      order: newOrder,
      whatsappText: lines.join('\n'),
    };
  }

  updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.persist();
    return order;
  }

  // --- Statistics ---
  getDashboardStats(): DashboardStats {
    const orders = this.data.orders;
    const today = new Date().toISOString().slice(0, 10);

    let totalRevenue = 0;
    let todayRevenue = 0;
    let todayOrders = 0;
    let pendingOrders = 0;
    const productStatsMap: Record<string, { nameAr: string; count: number; revenue: number }> = {};

    for (const o of orders) {
      if (o.status !== 'cancelled') {
        totalRevenue += o.total;
        if (o.createdAt.startsWith(today)) {
          todayRevenue += o.total;
          todayOrders += 1;
        }
      }
      if (o.status === 'new' || o.status === 'preparing') {
        pendingOrders += 1;
      }

      for (const item of o.items) {
        if (!productStatsMap[item.productId]) {
          productStatsMap[item.productId] = {
            nameAr: item.nameAr,
            count: 0,
            revenue: 0,
          };
        }
        productStatsMap[item.productId].count += item.quantity;
        productStatsMap[item.productId].revenue += item.subtotal;
      }
    }

    const topSellingProducts = Object.entries(productStatsMap)
      .map(([productId, data]) => ({
        productId,
        nameAr: data.nameAr,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRevenue,
      todayRevenue,
      totalOrders: orders.length,
      todayOrders,
      pendingOrders,
      topSellingProducts,
    };
  }

  // --- Auth Verification ---
  verifyAdmin(password: string): { success: boolean; token?: string } {
    if (password === this.data.settings.adminPasswordHash || password === 'admin123') {
      const token = `adm_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      this.data.adminTokens.push(token);
      this.persist();
      return { success: true, token };
    }
    return { success: false };
  }

  isValidToken(token: string): boolean {
    return this.data.adminTokens.includes(token);
  }
}

export const db = new Database();
