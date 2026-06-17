// src/utils/seoHelpers.ts

/**
 * مساعدات SEO إضافية
 * دوال مساعدة لتحسين محركات البحث
 */

/**
 * توليد slug من النص العربي
 */
export const generateSlug = (text: string): string => {
  if (!text) return "";

  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

/**
 * اقتطاع النص لطول محدد مع إضافة ...
 */
export const truncateText = (text: string, maxLength: number = 160): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * توليد meta description من المحتوى
 */
export const generateMetaDescription = (
  content: string,
  maxLength: number = 160
): string => {
  if (!content) return "";

  const cleanContent = content.replace(/<[^>]*>/g, "");
  return truncateText(cleanContent, maxLength);
};

/**
 * توليد keywords من النص
 */
export const generateKeywords = (
  text: string,
  maxKeywords: number = 10
): string => {
  if (!text) return "";

  const stopWords: string[] = [
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

  const words = text
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .filter((word) => !stopWords.includes(word))
    .map((word) => word.trim())
    .filter((word) => word);

  const uniqueWords = [...new Set(words)];
  return uniqueWords.slice(0, maxKeywords).join(", ");
};

/**
 * تحسين عنوان الصفحة لـ SEO
 */
export const optimizeTitle = (
  title: string,
  siteName: string = "كتالوج المرحومي",
  separator: string = "-"
): string => {
  if (!title) return siteName;

  const maxLength = 60;
  const fullTitle = `${title} ${separator} ${siteName}`;

  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }

  const availableLength = maxLength - siteName.length - separator.length - 2;
  const truncatedTitle = truncateText(title, availableLength).replace(
    /\.\.\.$/,
    ""
  );

  return `${truncatedTitle} ${separator} ${siteName}`;
};

/**
 * توليد canonical URL
 */
export const generateCanonicalUrl = (
  path: string,
  baseUrl: string = window.location.origin
): string => {
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBaseUrl}${cleanPath}`;
};

/**
 * خيارات توليد alt text للصورة
 */
export interface ImageAltOptions {
  productName?: string;
  category?: string;
  index?: number;
  description?: string;
}

/**
 * توليد alt text للصورة بناءً على السياق
 */
export const generateImageAlt = ({
  productName,
  category,
  index,
  description,
}: ImageAltOptions): string => {
  const parts: string[] = [];

  if (productName) parts.push(productName);
  if (category) parts.push(category);
  if (description) parts.push(description);
  if (index !== undefined) parts.push(`صورة ${index + 1}`);

  return parts.join(" - ");
};

/**
 * تحقق من صحة URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * معاملات UTM للتتبع
 */
export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

/**
 * إضافة UTM parameters لتتبع المصدر
 */
export const addUtmParams = (url: string, params: UtmParams = {}): string => {
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
 * معلومات SEO للصفحة
 */
export interface PageSeoInfo {
  url: string;
  pathname: string;
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

/**
 * تحليل وإرجاع معلومات SEO من الصفحة الحالية
 */
export const getCurrentPageSeoInfo = ():
  | PageSeoInfo
  | Record<string, never> => {
  if (typeof window === "undefined") return {};

  return {
    url: window.location.href,
    pathname: window.location.pathname,
    title: document.title,
    description:
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") || undefined,
    keywords:
      document
        .querySelector('meta[name="keywords"]')
        ?.getAttribute("content") || undefined,
    canonical:
      document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
      undefined,
    ogImage:
      document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content") || undefined,
  };
};

/**
 * منصات التواصل الاجتماعي المدعومة
 */
export type SocialPlatform =
  | "facebook"
  | "twitter"
  | "whatsapp"
  | "linkedin"
  | "telegram";

/**
 * خيارات المشاركة على وسائل التواصل
 */
export interface ShareOptions {
  url?: string;
  title?: string;
  text?: string;
}

/**
 * مشاركة الصفحة على وسائل التواصل
 */
export const shareOnSocial = (
  platform: SocialPlatform,
  options: ShareOptions = {}
): void => {
  const { url = window.location.href, title, text } = options;

  const shareUrls: Record<SocialPlatform, string> = {
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

  const shareUrl = shareUrls[platform.toLowerCase() as SocialPlatform];
  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400");
  }
};

/**
 * نسخ URL إلى الحافظة
 */
export const copyUrlToClipboard = async (
  url: string = window.location.href
): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return true;
    }

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
