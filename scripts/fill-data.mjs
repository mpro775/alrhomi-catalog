// Idempotent data fill / sync: creates the real ALMARHOMY categories, products
// and product images on the live API. Safe to re-run — it creates only what's
// missing (categories by name, products by productCode ALM-<sallaId>) and
// backfills images for any product that has none.
//
// Usage:
//   API_URL=https://api-almarohomi.smartagency-ye.com \
//   ADMIN_USER=admin ADMIN_PASS=*** node scripts/fill-data.mjs
import { readFile } from "fs/promises";

const API = process.env.API_URL || "https://api-almarohomi.smartagency-ye.com";
const USER = process.env.ADMIN_USER;
const PASS = process.env.ADMIN_PASS;
if (!USER || !PASS) { console.error("Set ADMIN_USER and ADMIN_PASS."); process.exit(1); }

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const idOf = (o) => o?._id || o?.id;

let TOKEN = "";
async function login() {
  const r = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USER, password: PASS }),
  });
  if (!r.ok) throw new Error(`login failed ${r.status}`);
  TOKEN = (await r.json()).token;
}

// JSON request with 429 (throttle) + 401 (token) retry
async function req(path, opts = {}, tries = 5) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(`${API}${path}`, {
      ...opts,
      headers: { Authorization: `Bearer ${TOKEN}`, ...(opts.headers || {}) },
    });
    if (r.status === 429) { await sleep(6000); continue; }
    if (r.status === 401) { await login(); continue; }
    const text = await r.text();
    let body; try { body = JSON.parse(text); } catch { body = text; }
    return { ok: r.ok, status: r.status, body };
  }
  return { ok: false, status: 429, body: "throttled" };
}

async function downloadImage(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/*" } });
      if (r.ok) return Buffer.from(await r.arrayBuffer());
    } catch { /* retry */ }
    await sleep(1500 * (i + 1));
  }
  return null;
}

async function uploadImage(productId, buf, code, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const fd = new FormData();
    fd.append("file", new Blob([buf], { type: "image/jpeg" }), `${code}.jpg`);
    fd.append("productId", productId);
    const up = await fetch(`${API}/images/upload`, {
      method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: fd,
    });
    if (up.status === 429) { await sleep(6000); continue; }
    if (up.ok) return true;
    return false;
  }
  return false;
}

async function main() {
  const seed = JSON.parse(await readFile(new URL("./seed.json", import.meta.url)));
  await login();
  console.log(`Logged in. seed: ${seed.categories.length} categories, ${seed.products.length} products\n`);

  // Categories
  const cats = await req("/categories?page=1&limit=100");
  const catByName = new Map();
  for (const c of cats.body?.items || []) catByName.set(c.name, idOf(c));
  for (const c of seed.categories) {
    if (catByName.has(c.name)) continue;
    const res = await req("/admin/categories", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: c.name, image: c.image }),
    });
    if (res.ok) { catByName.set(c.name, idOf(res.body)); console.log(`+ category: ${c.name}`); }
    else console.log(`! category failed: ${c.name} -> ${res.status}`);
    await sleep(400);
  }

  // Existing products: productCode -> {_id, imageCount}
  const prods = await req("/products?page=1&limit=100");
  const byCode = new Map();
  for (const p of prods.body?.items || []) byCode.set(p.productCode, { id: idOf(p), imageCount: p.imageCount || 0 });

  let created = 0, imgOk = 0, imgFail = 0;
  for (const p of seed.products) {
    const code = `ALM-${p.id}`;
    let entry = byCode.get(code);

    if (!entry) {
      const mainCat = p.categories?.[0]?.name || String(p.category).split("/")[0];
      const categoryId = catByName.get(mainCat);
      if (!categoryId) { console.log(`! no category for ${p.name}`); continue; }
      const tags = [...new Set(p.categories.map((c) => c.name))];
      const res = await req("/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productCode: code, productName: p.name, category: categoryId, tags }),
      });
      if (!res.ok) { console.log(`! product failed: ${p.name} -> ${res.status}`); continue; }
      entry = { id: idOf(res.body), imageCount: 0 };
      byCode.set(code, entry);
      created++;
      console.log(`+ product: ${p.name}`);
      await sleep(900);
    }

    if (entry.imageCount === 0) {
      const buf = await downloadImage(p.image);
      if (!buf) { imgFail++; console.log(`  ! image download failed: ${p.name}`); continue; }
      const ok = await uploadImage(entry.id, buf, code);
      if (ok) { imgOk++; entry.imageCount = 1; console.log(`  ✓ image: ${p.name}`); }
      else { imgFail++; console.log(`  ! image upload failed: ${p.name}`); }
      await sleep(900);
    }
  }

  console.log(`\nDone. created: ${created}, images ok: ${imgOk}, images failed: ${imgFail}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
