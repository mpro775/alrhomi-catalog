// src/utils/structuredData.ts

/**
 * إنشاء بيانات منظمة (Structured Data) بصيغة JSON-LD
 * لتحسين ظهور الموقع في نتائج البحث
 */

/**
 * نوع البيانات المنظمة للعنوان البريدي
 */
export interface PostalAddressSchema {
  "@type": "PostalAddress";
  addressCountry: string;
  addressLocality: string;
}

/**
 * نوع البيانات المنظمة لنقطة الاتصال
 */
export interface ContactPointSchema {
  "@type": "ContactPoint";
  contactType: string;
  availableLanguage: string[];
}

/**
 * نوع البيانات المنظمة للمؤسسة
 */
export interface OrganizationSchema {
  "@context": string;
  "@type": "Organization";
  name: string;
  alternateName: string;
  url: string;
  logo: string;
  description: string;
  address: PostalAddressSchema;
  contactPoint: ContactPointSchema;
  sameAs: string[];
}

/**
 * البيانات المنظمة للمؤسسة (Organization)
 */
export const getOrganizationSchema = (): OrganizationSchema => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "كتالوج المرحومي",
  alternateName: "Alrhomi Catalog",
  url: window.location.origin,
  logo: `${window.location.origin}/logo512.png`,
  description:
    "كتالوج المرحومي - منصة رائدة لعرض وتحميل صور المنتجات عالية الجودة",
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
  sameAs: [],
});

/**
 * نوع البيانات المنظمة لإجراء البحث
 */
export interface SearchActionSchema {
  "@type": "SearchAction";
  target: {
    "@type": "EntryPoint";
    urlTemplate: string;
  };
  "query-input": string;
}

/**
 * نوع البيانات المنظمة للموقع الإلكتروني
 */
export interface WebSiteSchema {
  "@context": string;
  "@type": "WebSite";
  name: string;
  url: string;
  potentialAction: SearchActionSchema;
}

/**
 * البيانات المنظمة للموقع الإلكتروني (WebSite)
 */
export const getWebSiteSchema = (): WebSiteSchema => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "كتالوج المرحومي",
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
 * نوع البيانات المنظمة للعلامة التجارية
 */
export interface BrandSchema {
  "@type": "Brand";
  name: string;
}

/**
 * نوع البيانات المنظمة للعرض
 */
export interface OfferSchema {
  "@type": "Offer";
  price: number;
  priceCurrency: string;
  availability: string;
  url: string;
}

/**
 * معلومات المنتج للبيانات المنظمة
 */
export interface ProductInfo {
  name?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  brand?: string;
  category?: string;
  id?: string;
  sku?: string;
  price?: number;
}

/**
 * نوع البيانات المنظمة للمنتج
 */
export interface ProductSchema {
  "@context": string;
  "@type": "Product";
  name: string;
  description: string;
  image: string;
  brand: BrandSchema;
  category: string;
  sku: string;
  offers?: OfferSchema;
}

/**
 * البيانات المنظمة لصفحة المنتج (Product)
 */
export const getProductSchema = (product: ProductInfo): ProductSchema => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name || product.title || "",
  description: product.description || "صورة منتج عالية الجودة",
  image: product.imageUrl || product.url || "",
  brand: {
    "@type": "Brand",
    name: product.brand || "كتالوج المرحومي",
  },
  category: product.category || "منتجات عامة",
  sku: product.id || product.sku || "",
  offers: {
    "@type": "Offer",
    price: product.price || 0,
    priceCurrency: "YER",
    availability: "https://schema.org/InStock",
    url: `${window.location.origin}/product/${product.id}`,
  },
});

/**
 * عنصر في قائمة مسارات التنقل
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * عنصر في قائمة البيانات المنظمة
 */
export interface ListItemSchema {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

/**
 * نوع البيانات المنظمة لقائمة مسارات التنقل
 */
export interface BreadcrumbListSchema {
  "@context": string;
  "@type": "BreadcrumbList";
  itemListElement: ListItemSchema[];
}

/**
 * البيانات المنظمة لمسارات التنقل (BreadcrumbList)
 */
export const getBreadcrumbSchema = (
  items: BreadcrumbItem[]
): BreadcrumbListSchema => ({
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
 * عنصر في قائمة العناصر
 */
export interface ItemForList {
  _id: string;
  productName?: string;
  name?: string;
  title?: string;
}

/**
 * نوع البيانات المنظمة لقائمة العناصر
 */
export interface ItemListSchema {
  "@context": string;
  "@type": "ItemList";
  name: string;
  numberOfItems: number;
  itemListElement: ListItemSchema[];
}

/**
 * البيانات المنظمة للمجموعة (ItemList)
 */
export const getItemListSchema = (
  items: ItemForList[],
  category?: string
): ItemListSchema => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: category ? `${category} - كتالوج المرحومي` : "كتالوج المنتجات",
  numberOfItems: items.length,
  itemListElement: items.slice(0, 10).map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: `${window.location.origin}/product/${item._id}`,
    name: item.productName || item.name || item.title || "",
  })),
});

/**
 * نوع عام للبيانات المنظمة
 */
export type StructuredDataSchema =
  | OrganizationSchema
  | WebSiteSchema
  | ProductSchema
  | BreadcrumbListSchema
  | ItemListSchema;

/**
 * إدراج البيانات المنظمة في الصفحة
 */
export const injectStructuredData = (schema: StructuredDataSchema): void => {
  if (typeof window === "undefined") return;

  const existingScript = document.querySelector(
    'script[type="application/ld+json"]'
  );
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * إدراج عدة مخططات منظمة
 */
export const injectMultipleSchemas = (
  schemas: StructuredDataSchema[]
): void => {
  if (typeof window === "undefined") return;

  const existingScripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  existingScripts.forEach((script) => script.remove());

  schemas.forEach((schema) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  });
};
