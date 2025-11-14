# دليل البدء السريع - تحسينات SEO

## 🚀 البدء السريع

### 1. استخدام مكون SEO في صفحة جديدة

```jsx
import SEO from "../components/SEO";

function MyPage() {
  return (
    <>
      <SEO
        title="عنوان الصفحة - كتالوج الرحومي"
        description="وصف الصفحة يجب أن يكون بين 150-160 حرف"
        keywords="كلمة1, كلمة2, كلمة3"
        image="/path/to/image.jpg"
        type="website"
      />
      
      {/* محتوى الصفحة */}
    </>
  );
}
```

### 2. إضافة Structured Data

```jsx
import { useEffect } from "react";
import {
  getProductSchema,
  injectStructuredData
} from "../utils/structuredData";

function ProductPage({ product }) {
  useEffect(() => {
    if (product) {
      const schema = getProductSchema({
        id: product._id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        category: product.category,
        price: product.price, // اختياري
      });
      
      injectStructuredData(schema);
    }
  }, [product]);
  
  return (/* ... */);
}
```

### 3. استخدام دوال SEO المساعدة

```jsx
import {
  generateSlug,
  optimizeTitle,
  generateImageAlt,
  shareOnSocial
} from "../utils/seoHelpers";

// توليد slug للمنتج
const slug = generateSlug("اسم المنتج هنا");
// النتيجة: "اسم-المنتج-هنا"

// تحسين العنوان
const title = optimizeTitle("عنوان طويل جداً...");
// النتيجة: "عنوان طويل - كتالوج الرحومي"

// توليد alt text للصورة
const alt = generateImageAlt({
  productName: "منتج",
  category: "فئة",
  index: 0
});
// النتيجة: "منتج - فئة - صورة 1"

// مشاركة على وسائل التواصل
shareOnSocial("facebook", {
  url: window.location.href,
  title: "عنوان المشاركة"
});
```

## 📋 قائمة التحقق السريعة لكل صفحة جديدة

- [ ] إضافة مكون SEO مع title و description فريدين
- [ ] إضافة Structured Data المناسبة
- [ ] التأكد من وجود alt texts لجميع الصور
- [ ] اختبار الصفحة على Mobile-Friendly Test
- [ ] اختبار Rich Results على Google

## 🎨 أمثلة حسب نوع الصفحة

### صفحة منتج واحد

```jsx
<SEO
  title={`${product.name} - كتالوج الرحومي`}
  description={`تفاصيل ${product.name} - ${product.category}. صورة عالية الجودة مع إمكانية التحميل المباشر.`}
  keywords={`${product.name}, ${product.category}, صور منتجات`}
  image={product.imageUrl}
  type="product"
/>
```

### صفحة فئة

```jsx
<SEO
  title={`${category.name} - كتالوج الرحومي`}
  description={`تصفح مجموعة ${category.name} في كتالوج الرحومي. ${category.itemCount} منتج متوفر.`}
  keywords={`${category.name}, كتالوج, منتجات`}
  type="website"
/>
```

### صفحة بحث

```jsx
<SEO
  title={`نتائج البحث عن "${searchQuery}" - كتالوج الرحومي`}
  description={`نتائج البحث عن ${searchQuery}. وجدنا ${resultsCount} نتيجة.`}
  keywords={`${searchQuery}, بحث, منتجات`}
  type="website"
/>
```

## 🔧 إعدادات مهمة

### تحديث Domain في الملفات

قم بتحديث النطاق في الملفات التالية:

1. **public/sitemap.xml**
   ```xml
   <loc>https://yourdomain.com/</loc>
   ```

2. **public/robots.txt**
   ```
   Sitemap: https://yourdomain.com/sitemap.xml
   ```

3. **src/utils/structuredData.js**
   ```javascript
   url: window.location.origin // يتم تحديثه تلقائياً
   ```

### إضافة Google Analytics

في `public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### إضافة Google Search Console

أضف verification meta tag في `public/index.html`:

```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

## 🧪 اختبار التحسينات

### 1. اختبار محلي

```bash
npm start
```

ثم افتح:
- http://localhost:3000
- تفقد source code لرؤية meta tags
- تفقد Console للتأكد من عدم وجود أخطاء

### 2. اختبارات Online

بعد رفع الموقع:

1. **Google Search Console**: https://search.google.com/search-console
2. **Rich Results Test**: https://search.google.com/test/rich-results
3. **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
4. **PageSpeed Insights**: https://pagespeed.web.dev/
5. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
6. **Twitter Card Validator**: https://cards-dev.twitter.com/validator

## 📈 مراقبة الأداء

### أسبوعياً
- تحقق من Google Search Console للأخطاء
- راجع تقرير Coverage
- تحقق من Performance report

### شهرياً
- تحليل Organic Traffic
- مراجعة Top Queries
- تحديث المحتوى القديم
- إضافة محتوى جديد

## 💡 نصائح سريعة

1. **Title Tags**: 50-60 حرف (بما فيها اسم الموقع)
2. **Meta Descriptions**: 150-160 حرف
3. **Keywords**: 5-10 كلمات مفتاحية ذات صلة
4. **Images**: دائماً أضف alt text
5. **URLs**: استخدم URLs وصفية وقصيرة
6. **Content**: اكتب للمستخدمين أولاً، ثم لمحركات البحث
7. **Mobile**: تأكد من أن الموقع متجاوب تماماً
8. **Speed**: احرص على سرعة تحميل < 3 ثوانٍ

## ❓ الأسئلة الشائعة

### متى أرى نتائج SEO؟
عادةً 3-6 أشهر للنتائج الملموسة.

### كم مرة أحدّث المحتوى؟
على الأقل مرة شهرياً، أو عند إضافة منتجات جديدة.

### هل أحتاج إلى الدفع لخدمات SEO؟
البداية مجانية (Google Search Console, Analytics)، لكن الأدوات المتقدمة قد تكون مدفوعة.

### كيف أتتبع التحسينات؟
استخدم Google Analytics و Search Console لمراقبة:
- Organic traffic
- Keyword rankings
- Click-through rate (CTR)
- Bounce rate

---

**للمزيد من التفاصيل**: راجع `SEO_README.md` و `SEO_CHECKLIST.md`

