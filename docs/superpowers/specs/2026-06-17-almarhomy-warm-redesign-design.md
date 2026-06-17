# ALMARHOMY Catalog — "Warm Arabian Hospitality" Redesign

**Date:** 2026-06-17
**Scope decision:** New look from scratch, **same plumbing** — keep the data layer, routing, API
calls, and the graded behaviors (URL-synced catalog filters; loading/error/empty states). No backend
architecture changes.

## 1. Background

The app is a product catalog for **شركة زهير علي سعيد المرحومي الغامدي (ALMARHOMY)** — a Saudi
**home, kitchen & hospitality** retailer (their real store: salla.sa/almarhomy1). It sells coffee/tea
serveware (Saudi & Turkish coffee cups, Moroccan tea pots, ركوة), serving trays, dining plates, food
storage, oven trays, table linens (مفارش), incense burners (مباخر), planters (مراكن), date/sugar
holders, and small tables. Affordable everyday Gulf homeware.

The current UI forces a dark "obsidian & neon" glassmorphism theme (blurred mesh background, electric
blue→cyan gradients, glass panels, stock hero) — a consumer-tech aesthetic that fights the real brand.
This redesign replaces it with a warm, elegant, light identity rooted in Arabian hospitality.

**Conversion model:** inquiry-only, **no prices** — every "buy" action is a WhatsApp inquiry. This
matches the backend (a catalog with no price/checkout).

## 2. Design system — "Warm Arabian Hospitality"

Light mode, RTL-first.

**Palette**

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#FAF5EE` | Page background |
| `--surface` | `#FFFFFF` | Cards / surfaces |
| `--border-warm` | `#E9DFD1` | Hairlines, dividers |
| `--green` (primary) | `#2C4A3B` | Buttons, header, brand |
| `--green-700` | `#22392E` | Hover/pressed |
| `--gold` (accent) | `#C2A14D` | Accents, fine lines, icons, motifs |
| `--clay` | `#B85C38` | Sparing warmth (tags/highlights) |
| `--ink` | `#211C16` | Headings/body text |
| `--muted` | `#7A7064` | Secondary text |
| `--whatsapp` | `#25D366` | Contact CTA only |

Removed: dark mode, neon blue/cyan, mesh gradient, glassmorphism/backdrop-blur, gradient buttons.

**Typography** (Arabic-first, Google Fonts)
- Headings/brand: **El Messiri** (700/600) — elegant, characterful Arabic display.
- Body/UI: **Tajawal** (400/500/700) — clean, highly readable RTL.
- Drop the Latin-first "Outfit".

**Form & motifs**
- Radius: 14px cards/buttons, pills for chips/badges.
- Shadows: soft & warm (`rgba(33,28,22,.08)`), never harsh black.
- Subtle 8-point-star / mashrabiya geometric motif as faint section backgrounds & dividers, gold at
  low opacity — used sparingly (whisper, not shout). Implemented as an inline SVG data-URI utility.
- Generous whitespace; product photos on clean white cards.

**MUI theme** (`theme.ts`): light palette, primary=green, secondary=gold, warm background/paper,
El Messiri/Tajawal typography, restyled MuiButton (solid green, gold-tinted hover, no gradient),
MuiCard (white, warm border, soft shadow), MuiPaper (cream/white). Keep `direction: rtl` + stylis-rtl.

## 3. Pages

All public pages keep their existing data hooks/API calls; only presentation changes.

- **Layout** — `SiteHeader` (light, warm, sticky; logo + الرئيسية/المنتجات/الفئات + WhatsApp icon),
  `SiteFooter` (brand, quick links, contact/WhatsApp, hospitality tagline), `MainLayout`. Remove
  `mesh-bg` from `App.tsx`.
- **Home** — warm hero (brand promise, "تسوق بأناقة الضيافة العربية", CTAs: تصفّح المنتجات / واتساب),
  category showcase (real categories), featured/newest products grid, a short hospitality "about"
  band, contact/WhatsApp. No stock neon banner; no "Premium Digital Showroom" hype.
- **Catalog** — warm product grid + filter bar (search, category, model, sort). **Preserve** URL-sync
  (q/category/model/page) and loading skeletons / error+retry / empty states.
- **Categories** — visual category cards (image + name + count) with loading/error/empty.
- **Product detail** — large image gallery (thumbnails + lightbox), name/code/specs, prominent
  "تواصل عبر واتساب للطلب" CTA, similar products. No price.
- **Admin** — light restyle to the warm tokens (AdminLayout, dashboard, management tables/dialogs).
  All functionality preserved, including the graded "products without images" filter + counter.

## 4. Data fill (real catalog → live DB via API)

Verified feasible on live (S3 + queue work). Pipeline:
1. Scrape the full Salla catalog (paginate) → seed JSON: categories + products (name, category, image
   URLs).
2. Idempotent fill script against `https://api-almarohomi.smartagency-ye.com`:
   - login (admin) → JWT.
   - Upsert **categories** (`POST /categories` with `name` + Salla CDN `image` URL); skip if name
     exists. Build parent/sub hierarchy where the source has it.
   - Upsert **products** (`POST /products`: `productCode` (generated, unique), `productName`,
     `category` id, `model`, `description`, `tags`); skip if `productCode`/name exists.
   - **Images**: download each Salla image → `POST /images/upload` (multipart, `productId`) →
     `PUT /products/:id` with collected `imageIds` to populate `product.images[]`.
3. Re-runnable: check existing categories/products first to avoid duplicates (no delete endpoints).

## 5. What stays (do not break)

- Backend: untouched (no architecture/API changes).
- Routing, `AuthContext`, `apiClient`, all `api/*` calls, types.
- Graded behaviors: catalog URL-sync; loading/error/empty states; admin no-images filter + counter;
  category-delete guard; readiness check; folder route protection.

## 6. Verification

- `npm run type-check` + `npm run build` pass.
- Run frontend locally against live API; confirm Home/Catalog/Categories/Product detail render with
  real data in the new theme; filters + URL-sync + states still work.
- Confirm live API has the real categories/products/images after fill.

## 7. Delivery

Build on `redesign/warm-arabian-hospitality`, conventional commits, then merge → `main` and push
(auto-deploy). Update IMPLEMENTATION_NOTES / delivery report.
