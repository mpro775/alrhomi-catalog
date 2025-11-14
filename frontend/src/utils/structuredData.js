// src/utils/structuredData.js

/**
 * إنشاء بيانات منظمة (Structured Data) بصيغة JSON-LD
 * لتحسين ظهور الموقع في نتائج البحث
 */

/**
 * البيانات المنظمة للمؤسسة (Organization)
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "كتالوج الرحومي",
  alternateName: "Alrhomi Catalog",
  url: window.location.origin,
  logo: `${window.location.origin}/logo512.png`,
  description:
    "كتالوج الرحومي - منصة رائدة لعرض وتحميل صور المنتجات عالية الجودة",
  address: {
    "@type": "PostalAddress",
    addressCountry: "YE",
    addressLocality: "صنعاء",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Arabic", "English"],
  },
  sameAs: [
    // أضف روابط وسائل التواصل الاجتماعي هنا
  ],
});

/**
 * البيانات المنظمة للموقع الإلكتروني (WebSite)
 */
export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "كتالوج الرحومي",
  url: window.location.origin,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${window.location.origin}/catalog?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

/**
 * البيانات المنظمة لصفحة المنتج (Product)
 */
export const getProductSchema = (product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name || product.title,
  description: product.description || "صورة منتج عالية الجودة",
  image: product.imageUrl || product.url,
  brand: {
    "@type": "Brand",
    name: product.brand || "كتالوج الرحومي",
  },
  category: product.category || "منتجات عامة",
  sku: product.id || product.sku,
  ...(product.price && {
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "YER",
      availability: "https://schema.org/InStock",
      url: `${window.location.origin}/product/${product.id}`,
    },
  }),
});

/**
 * البيانات المنظمة لمسارات التنقل (BreadcrumbList)
 */
export const getBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${window.location.origin}${item.path}`,
  })),
});

/**
 * البيانات المنظمة للمجموعة (ItemList)
 */
export const getItemListSchema = (items, category) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: category ? `${category} - كتالوج الرحومي` : "كتالوج المنتجات",
  numberOfItems: items.length,
  itemListElement: items.slice(0, 10).map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${window.location.origin}/product/${item.id}`,
    name: item.name || item.title,
  })),
});

/**
 * إدراج البيانات المنظمة في الصفحة
 */
export const injectStructuredData = (schema) => {
  if (typeof window === "undefined") return;

  // إزالة البيانات المنظمة القديمة
  const existingScript = document.querySelector(
    'script[type="application/ld+json"]'
  );
  if (existingScript) {
    existingScript.remove();
  }

  // إضافة البيانات المنظمة الجديدة
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * إدراج عدة مخططات منظمة
 */
export const injectMultipleSchemas = (schemas) => {
  if (typeof window === "undefined") return;

  // إزالة البيانات المنظمة القديمة
  const existingScripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  existingScripts.forEach((script) => script.remove());

  // إضافة البيانات المنظمة الجديدة
  schemas.forEach((schema) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  });
};

