# ALMARHOMY — UI/UX Redesign + Real Data Fill

تقرير تسليم — إعادة تصميم الواجهة وتعبئة البيانات الحقيقية
Branch: `redesign/warm-arabian-hospitality` → merged to `main` (auto-deploy).

## Summary

Full visual redesign of the public catalog from the previous dark "neon glassmorphism"
look to a warm, light **"Warm Arabian Hospitality"** identity that fits the real business
(شركة المرحومي — home, kitchen & hospitality goods). **Same plumbing**: no backend changes;
routing, API calls, auth, and the graded behaviors were preserved. The live catalog was also
populated with the real ALMARHOMY categories and products.

## Design system (new)

- **Palette (light):** cream `#FAF5EE`, white surfaces, Majlis green `#2C4A3B` (primary),
  brass gold `#C2A14D` (accent), clay, ink/muted text. Removed dark mode, neon blue/cyan,
  mesh background, and glassmorphism.
- **Type:** El Messiri (headings) + Tajawal (body) — Arabic-first, RTL.
- **Details:** subtle 8-point-star / mashrabiya motif, soft warm shadows, restrained radii.
- Files: `theme.ts`, `index.css`, `App.css`, `public/index.html` (fonts, title, meta, theme-color).

## Pages & components redesigned

- **Layout:** light sticky header with Arabic brand + mobile drawer; green footer with honest
  hospitality identity (removed fabricated "since 1955 / address / phone"); motif backdrop.
- **Home:** hospitality hero, category showcase, latest products, about/contact. Real copy.
- **Catalog:** warm grid + filters; **preserved** URL-synced filters (q/category/sort/page);
  added retry + empty states alongside loading.
- **Categories & Product detail:** adopt the warm theme; loading/error/empty, gallery,
  WhatsApp inquiry CTA, similar products.
- **Components:** ImageCard, CategoryShowcase, SearchBar, Filters, AboutContactSection.
- **Admin:** light-touch — adopts the warm theme via tokens; functionality unchanged
  (incl. the graded "products without images" filter + counter).
- Brand standardized to **المرحومي** across UI & SEO.

## Real data fill (live)

Source: the real ALMARHOMY catalog (Salla store `salla.sa/almarhomy1`), scraped via
`scripts/scrape-catalog.mjs` → `scripts/seed.json`. Loaded with `scripts/fill-data.mjs`
(idempotent; creds via env). Result on live:

- **14 categories** created (real Arabic names: أطقم القهوة والشاي، صواني التقديم، حافظات
  الطعام، مباخر، مفارش، …).
- **31 products** created with real names, categories, and tags.
- **10 product images** uploaded (real photos on `cdn.salla.sa`, watermarked via the existing
  queue). The other **21** products' only image URL is on Salla's internal origin
  `storage.linker-sellers.com`, which is **not publicly resolvable (NXDOMAIN)** — those images
  cannot be fetched by anyone outside Salla. The UI shows a clean on-brand placeholder for them
  (`utils/fallbackImage.ts`), and they display correctly once images are added.

To complete the remaining images later, the reliable path is a **Salla product export**
(merchant dashboard → CSV/Excel with image files) or a headless-browser render of the store;
then re-run `node scripts/fill-data.mjs`.

## Preserved (not broken)

Backend untouched; routing, `AuthContext`, `apiClient`, all `api/*` calls and types intact;
catalog URL-sync, loading/error/empty states, admin no-images filter + counter, category-delete
guard, readiness check, folder route protection.

## Verification

- `tsc --noEmit` ✅  ·  `npm run build` ✅ (clean production bundle).
- Live API verified: 31 products / 14 categories present; public endpoints serve them.

## Deploy

Merged to `main` and pushed → Coolify auto-deploy of `almarohomi.smartagency-ye.com`
(frontend) against `api-almarohomi.smartagency-ye.com`.

## Possible follow-ups

- Add the remaining 21 product images via Salla export (above).
- Optional deeper admin visual polish.
- Optional: sort-by `model` filter + URL sync (not required by current UI).
