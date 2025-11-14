// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      // Navigation & Common
      "home": "الرئيسية",
      "catalog": "الكتالوج",
      "admin": "الإدارة",
      "login": "تسجيل الدخول",
      "logout": "تسجيل الخروج",
      "dashboard": "لوحة التحكم",
      "settings": "الإعدادات",

      // Authentication
      "username": "اسم المستخدم",
      "password": "كلمة المرور",
      "loginButton": "دخول",
      "loginError": "اسم المستخدم أو كلمة المرور غير صحيحة",
      "welcome": "مرحباً",

      // Dashboard
      "adminDashboard": "لوحة التحكم الإدارية",
      "dashboardSubtitle": "نظرة عامة شاملة على إحصائيات النظام وأدائه",
      "totalImages": "إجمالي الصور",
      "watermarkedImages": "الصور المعلمة",
      "pendingJobs": "المهام المعلقة",
      "activeUsers": "المستخدمين النشطين",

      // Categories
      "categories": "الفئات",
      "addCategory": "إضافة فئة",
      "categoryName": "اسم الفئة",
      "editCategory": "تعديل الفئة",
      "deleteCategory": "حذف الفئة",

      // Products
      "products": "المنتجات",
      "addProduct": "إضافة منتج",
      "productName": "اسم المنتج",
      "editProduct": "تعديل المنتج",
      "deleteProduct": "حذف المنتج",

      // Images
      "images": "الصور",
      "uploadImage": "رفع صورة",
      "imageManagement": "إدارة الصور",

      // Users
      "users": "المستخدمين",
      "addUser": "إضافة مستخدم",
      "userManagement": "إدارة المستخدمين",

      // Actions
      "save": "حفظ",
      "cancel": "إلغاء",
      "edit": "تعديل",
      "delete": "حذف",
      "confirm": "تأكيد",
      "yes": "نعم",
      "no": "لا",
      "close": "إغلاق",

      // Messages
      "success": "نجح",
      "error": "خطأ",
      "loading": "جاري التحميل...",
      "noData": "لا توجد بيانات",
      "confirmDelete": "هل أنت متأكد من الحذف؟",

      // Search & Filters
      "search": "بحث",
      "filter": "تصفية",
      "clear": "مسح",

      // Table
      "rowsPerPage": "عدد الصفوف في الصفحة",
      "of": "من",

      // Category Management
      "categoriesManagement": "إدارة الفئات",
      "categoriesManagementDesc": "إدارة وتنظيم فئات المنتجات بشكل هرمي",
      "newCategory": "فئة جديدة",
      "totalCategories": "إجمالي الفئات",
      "noCategories": "لا توجد فئات",
      "startCreateCategory": "ابدأ بإنشاء فئة جديدة لإدارة منتجاتك",
      "createNewCategory": "إنشاء فئة جديدة",
      "image": "الصورة",
      "actions": "الإجراءات",
      "categoriesPerPage": "عدد الفئات لكل صفحة",
      "editCategoryDialog": "تعديل الفئة",
      "createCategoryDialog": "إنشاء فئة جديدة",
      "parentCategory": "التصنيف الأب (اختياري)",
      "noParent": "لا يوجد (تصنيف رئيسي)",
      "categoryNameRequired": "اسم الفئة مطلوب",
      "descriptionOptional": "الوصف (اختياري)",
      "categoryImage": "صورة الفئة",
      "uploadImageDesc": "ارفع صورة من جهازك لتمييز هذه الفئة داخل لوحة التحكم.",
      "uploading": "جارٍ الرفع...",
      "uploadImageBtn": "رفع صورة",
      "removeCurrentImage": "إزالة الصورة الحالية",
      "saving": "جاري الحفظ...",
      "saveChanges": "حفظ التعديلات",
      "create": "إنشاء",
      "confirmDeleteCategory": "هل أنت متأكد من حذف الفئة",
      "deleteWarning": "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع الفئات الفرعية المرتبطة بهذه الفئة أيضاً.",
      "deleting": "جاري الحذف...",
      "loadCategoriesFailed": "فشل في تحميل الفئات. يرجى المحاولة مرة أخرى.",
      "saveCategoryFailed": "فشل في حفظ الفئة. يرجى المحاولة مرة أخرى.",
      "imageSizeError": "حجم الصورة يجب ألا يتجاوز 4 ميغابايت.",
      "imageUrlError": "لم يتم استلام رابط للصورة.",
      "uploadImageFailed": "فشل رفع الصورة. يرجى المحاولة لاحقاً.",
      "deleteCategoryFailed": "فشل في حذف الفئة. يرجى المحاولة مرة أخرى.",
      "subcategory": "فرعية",
      "mainCategory": "رئيسية",
      "noDescription": "لا يوجد وصف",

      // Tooltips

      // Image Management
      "imageManagementDesc": "تنظيم مكتبة الصور والتحكم بالعلامة المائية",
      "addNewImage": "إضافة صورة جديدة",
      "newImage": "صورة جديدة",
      "searchImagePlaceholder": "ابحث عن صورة أو منتج...",
      "noImagesYet": "لا توجد صور حتى الآن",
      "noMatchingResults": "لا توجد نتائج مطابقة",
      "startAddingImages": "ابدأ بإضافة صور جديدة وإدارتها بسهولة",
      "tryChangingSearch": "حاول تغيير كلمات البحث أو إعادة التعيين",
      "addImage": "إضافة صورة",
      "removeWatermark": "إزالة العلامة المائية",
      "enableWatermark": "تفعيل العلامة المائية",
      "watermarked": "مُعلّمة",
      "noWatermark": "بدون علامة",
      "uncategorized": "فئة غير محددة",
      "imageWithoutProduct": "صورة بدون منتج",
      "model": "موديل",
      "note": "ملاحظة",
      "uploadedAt": "تم الرفع",
      "deleteImage": "حذف الصورة",
      "addNewImageDialog": "إضافة صورة جديدة",
      "fileSelectedSuccess": "تم اختيار الملف بنجاح",
      "changeFile": "تغيير الملف",
      "dragDropImage": "اسحب وأفلت الصورة هنا",
      "clickToSelect": "أو انقر لاختيار ملف من جهازك",
      "chooseFile": "اختر ملفًا",
      "linkImageToProduct": "ربط الصورة بمنتج (اختياري)",

      // Status Labels
      "statusQueued": "بالانتظار",
      "statusProcessing": "جاري",
      "statusCompleted": "مكتمل",
      "statusFailed": "فشل",

      // Chart Labels
      "processed": "معالجة",
      "pending": "بانتظار",

      // User Management
      "userManagementDesc": "إدارة حسابات المستخدمين والصلاحيات",
      "searchUserPlaceholder": "ابحث عن مستخدم...",
      "newUser": "مستخدم جديد",
      "noUsersFound": "لم يتم العثور على مستخدمين",
      "noUsersYet": "لم تقم بإضافة أي مستخدمين بعد",
      "noMatchingUsers": "لا توجد نتائج مطابقة لبحثك",
      "addNewUser": "إضافة مستخدم جديد",
      "repRole": "مندوب",
      "adminRole": "مدير",
      "active": "نشط",
      "inactive": "غير نشط",
      "creationDate": "تاريخ الإنشاء",
      "lastActivity": "آخر نشاط",
      "neverLoggedIn": "لم يسجل دخول بعد",
      "editUser": "تعديل المستخدم",
      "deleteUser": "حذف المستخدم",
      "usersPerPage": "مستخدمين لكل صفحة",
      "createNewUser": "إنشاء مستخدم جديد",
      "email": "البريد الإلكتروني",
      "role": "الدور",
      "userCreatedSuccess": "تم إنشاء المستخدم بنجاح!",
      "temporaryPassword": "كلمة المرور المؤقتة للمستخدم",

      // Product Management
      "productManagement": "إدارة المنتجات",
      "productManagementDesc": "تحكم كامل في بيانات المنتجات وربطها بالصور",
      "newProduct": "منتج جديد",
      "searchProductPlaceholder": "ابحث باسم المنتج، الكود أو الوصف...",
      "category": "الفئة",
      "allCategories": "كل الفئات",
      "product": "المنتج",
      "code": "الكود",
      "imagesCount": "عدد الصور",
      "noProducts": "لا توجد منتجات",
      "startAddingProduct": "ابدأ بإضافة منتج جديد لإدارته لاحقاً",
      "productsPerPage": "منتجات لكل صفحة",
      "editProductDialog": "تعديل المنتج",
      "addProductDialog": "إضافة منتج جديد",
      "productCode": "كود المنتج",
      "chooseCategory": "اختر فئة",
      "loadProductsFailed": "فشل في تحميل المنتجات. حاول مرة أخرى.",
      "saveProductFailed": "فشل في حفظ المنتج. حاول مرة أخرى.",
      "deleteProductFailed": "فشل في حذف المنتج. حاول مرة أخرى.",

      // Catalog
      "catalogTitle": "كتالوج الصور",
      "catalogDesc": "تصفح مكتبتنا الواسعة من الصور عالية الجودة. استخدم البحث والتصفية لتجد ما تحتاجه بسرعة.",
      "noResultsFound": "لم يتم العثور على نتائج",
      "modifySearchFilters": "حاول تعديل معايير البحث أو الفلاتر",
      "showing": "عرض",

      // Filters
      "model2023": "موديل 2023",
      "model2024": "موديل 2024",
      "classic": "كلاسيك",
      "pro": "برو",
      "lite": "لايت",
      "all": "الكل",
      "clearAll": "مسح الكل",

      // Navigation
      "productsManagement": "إدارة المنتجات",
      "imagesManagement": "إدارة الصور",
      "usersManagement": "إدارة المستخدمين",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    lng: 'ar',

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
