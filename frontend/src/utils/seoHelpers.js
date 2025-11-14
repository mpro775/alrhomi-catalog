// src/utils/seoHelpers.js

/**
 * مساعدات SEO إضافية
 * دوال مساعدة لتحسين محركات البحث
 */

/**
 * توليد slug من النص العربي
 * @param {string} text - النص المراد تحويله
 * @returns {string} - slug مناسب للـ URL
 */
export const generateSlug = (text) => {
  if (!text) return "";
  
  // تنظيف النص
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // استبدال المسافات بـ -
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "") // إزالة الرموز غير المرغوبة
    .replace(/-+/g, "-") // إزالة - المتكررة
    .replace(/^-|-$/g, ""); // إزالة - من البداية والنهاية
};

/**
 * اقتطاع النص لطول محدد مع إضافة ...
 * @param {string} text - النص
 * @param {number} maxLength - الطول الأقصى
 * @returns {string} - النص المقتطع
 */
export const truncateText = (text, maxLength = 160) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * توليد meta description من المحتوى
 * @param {string} content - المحتوى
 * @param {number} maxLength - الطول الأقصى (افتراضي 160)
 * @returns {string} - description مناسبة
 */
export const generateMetaDescription = (content, maxLength = 160) => {
  if (!content) return "";
  
  // إزالة HTML tags إن وجدت
  const cleanContent = content.replace(/<[^>]*>/g, "");
  
  // اقتطاع النص
  return truncateText(cleanContent, maxLength);
};

/**
 * توليد keywords من النص
 * @param {string} text - النص
 * @param {number} maxKeywords - عدد الكلمات المفتاحية الأقصى
 * @returns {string} - keywords مفصولة بفواصل
 */
export const generateKeywords = (text, maxKeywords = 10) => {
  if (!text) return "";
  
  // كلمات شائعة يجب تجاهلها
  const stopWords = [
    "في",
    "من",
    "إلى",
    "على",
    "عن",
    "مع",
    "هذا",
    "هذه",
    "الذي",
    "التي",
    "و",
    "أو",
    "لكن",
    "أن",
    "إن",
    "ما",
  ];
  
  // استخراج الكلمات
  const words = text
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .filter((word) => !stopWords.includes(word))
    .map((word) => word.trim())
    .filter((word) => word);
  
  // إزالة التكرار
  const uniqueWords = [...new Set(words)];
  
  // أخذ أول maxKeywords كلمة
  return uniqueWords.slice(0, maxKeywords).join(", ");
};

/**
 * تحسين عنوان الصفحة لـ SEO
 * @param {string} title - العنوان الأصلي
 * @param {string} siteName - اسم الموقع (افتراضي: كتالوج الرحومي)
 * @param {string} separator - الفاصل (افتراضي: -)
 * @returns {string} - العنوان المحسّن
 */
export const optimizeTitle = (
  title,
  siteName = "كتالوج الرحومي",
  separator = "-"
) => {
  if (!title) return siteName;
  
  // تحديد الطول الأقصى (50-60 حرف مثالي)
  const maxLength = 60;
  const fullTitle = `${title} ${separator} ${siteName}`;
  
  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }
  
  // اقتطاع العنوان إذا كان طويلاً
  const availableLength = maxLength - siteName.length - separator.length - 2;
  const truncatedTitle = truncateText(title, availableLength).replace(
    /\.\.\.$/,
    ""
  );
  
  return `${truncatedTitle} ${separator} ${siteName}`;
};

/**
 * توليد canonical URL
 * @param {string} path - المسار
 * @param {string} baseUrl - الـ URL الأساسي
 * @returns {string} - canonical URL كامل
 */
export const generateCanonicalUrl = (path, baseUrl = window.location.origin) => {
  // إزالة / من نهاية baseUrl
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  
  // إضافة / في بداية path إذا لم تكن موجودة
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

/**
 * توليد alt text للصورة بناءً على السياق
 * @param {Object} options - خيارات
 * @returns {string} - alt text محسّن
 */
export const generateImageAlt = ({
  productName,
  category,
  index,
  description,
}) => {
  const parts = [];
  
  if (productName) parts.push(productName);
  if (category) parts.push(category);
  if (description) parts.push(description);
  if (index !== undefined) parts.push(`صورة ${index + 1}`);
  
  return parts.join(" - ");
};

/**
 * تحقق من صحة URL
 * @param {string} url - الـ URL
 * @returns {boolean} - true إذا كان URL صحيح
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * إضافة UTM parameters لتتبع المصدر
 * @param {string} url - الـ URL الأصلي
 * @param {Object} params - UTM parameters
 * @returns {string} - URL مع UTM parameters
 */
export const addUtmParams = (url, params = {}) => {
  try {
    const urlObj = new URL(url);
    
    const {
      source = "website",
      medium = "organic",
      campaign,
      content,
      term,
    } = params;
    
    urlObj.searchParams.set("utm_source", source);
    urlObj.searchParams.set("utm_medium", medium);
    if (campaign) urlObj.searchParams.set("utm_campaign", campaign);
    if (content) urlObj.searchParams.set("utm_content", content);
    if (term) urlObj.searchParams.set("utm_term", term);
    
    return urlObj.toString();
  } catch {
    return url;
  }
};

/**
 * تحليل وإرجاع معلومات SEO من الصفحة الحالية
 * @returns {Object} - معلومات SEO
 */
export const getCurrentPageSeoInfo = () => {
  if (typeof window === "undefined") return {};
  
  return {
    url: window.location.href,
    pathname: window.location.pathname,
    title: document.title,
    description: document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content"),
    keywords: document
      .querySelector('meta[name="keywords"]')
      ?.getAttribute("content"),
    canonical: document
      .querySelector('link[rel="canonical"]')
      ?.getAttribute("href"),
    ogImage: document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute("content"),
  };
};

/**
 * مشاركة الصفحة على وسائل التواصل
 * @param {string} platform - المنصة (facebook, twitter, whatsapp, linkedin)
 * @param {Object} options - خيارات المشاركة
 */
export const shareOnSocial = (platform, options = {}) => {
  const { url = window.location.href, title, text } = options;
  
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title || text || "")}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${title || text || ""} ${url}`
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title || text || "")}`,
  };
  
  const shareUrl = shareUrls[platform.toLowerCase()];
  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400");
  }
};

/**
 * نسخ URL إلى الحافظة
 * @param {string} url - الـ URL (افتراضي: الصفحة الحالية)
 * @returns {Promise<boolean>} - true إذا تم النسخ بنجاح
 */
export const copyUrlToClipboard = async (url = window.location.href) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return true;
    }
    
    // fallback للمتصفحات القديمة
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  } catch (error) {
    console.error("Failed to copy URL:", error);
    return false;
  }
};

