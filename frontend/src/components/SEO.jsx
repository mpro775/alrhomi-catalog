// src/components/SEO.jsx
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

/**
 * مكون تحسين محركات البحث (SEO)
 * يدير meta tags و Open Graph و Twitter Cards بشكل ديناميكي
 */
export default function SEO({
  title = "كتالوج الرحومي - صور منتجات عالية الجودة",
  description = "استكشف مجموعة واسعة من صور المنتجات عالية الجودة في كتالوج الرحومي. صور احترافية لجميع أنواع المنتجات مع إمكانية التحميل المباشر.",
  keywords = "كتالوج منتجات, صور منتجات, كتالوج الرحومي, صور احترافية, منتجات يمنية, كتالوج إلكتروني",
  image = "/logo512.png",
  type = "website",
  author = "كتالوج الرحومي",
}) {
  const location = useLocation();
  const baseUrl = window.location.origin;
  const currentUrl = `${baseUrl}${location.pathname}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang="ar" dir="rtl" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph Meta Tags (Facebook, LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={`${baseUrl}${image}`} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="ar_YE" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:site_name" content="كتالوج الرحومي" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${image}`} />
      <meta name="twitter:image:alt" content={title} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="Arabic" />
      <meta name="geo.region" content="YE" />
      <meta name="geo.placename" content="Yemen" />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Alternate Language Links */}
      <link rel="alternate" hrefLang="ar" href={currentUrl} />
      <link rel="alternate" hrefLang="en" href={currentUrl} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />

      {/* Theme Color for Mobile Browsers */}
      <meta name="theme-color" content="#1565c0" />
      <meta name="msapplication-TileColor" content="#1565c0" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#1565c0" />
    </Helmet>
  );
}

