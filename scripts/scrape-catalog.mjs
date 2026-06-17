// Scrapes the real ALMARHOMY catalog (categories + products + image URLs)
// from the mini-outlet brand listing, which embeds Salla product data
// (images on ALMARHOMY's own CDN cdn.salla.sa/Ynjro/...).
// Output: scripts/seed.json
import { writeFile } from "fs/promises";

const BRAND = "https://mini-outlet.com/brands/579969340";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const reProd =
  /\{"id":(\d+),"name":"(.*?)","categories":\[(.*?)\],"category":"(.*?)","price":([\d.]+),"quantity":\d+,"variant":".*?","brand":"المرحومي \| ALMARHOMY","image":"(.*?)"\}/gs;

const unesc = (s) => s.replace(/\\\//g, "/");
const byId = new Map();

for (let page = 1; page <= 20; page++) {
  const url = `${BRAND}?page=${page}`;
  let html = "";
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    html = await r.text();
  } catch (e) {
    console.log(`page ${page}: fetch error ${e.message}`);
    break;
  }
  let added = 0;
  let m;
  reProd.lastIndex = 0;
  while ((m = reProd.exec(html))) {
    const [, id, name, catsFrag, category, price, image] = m;
    if (byId.has(id)) continue;
    const cats = [...catsFrag.matchAll(/"id":(\d+),"name":"(.*?)"/g)].map((c) => ({
      id: c[1],
      name: c[2],
    }));
    byId.set(id, {
      id,
      name,
      categories: cats,
      category,
      price: Number(price),
      image: unesc(image),
    });
    added++;
  }
  console.log(`page ${page}: +${added} new (total ${byId.size})`);
  if (added === 0) break;
}

const products = [...byId.values()];
const catMap = new Map();
for (const p of products) {
  for (const c of p.categories) {
    if (!catMap.has(c.id)) catMap.set(c.id, { id: c.id, name: c.name, image: p.image });
  }
}
const categories = [...catMap.values()];
const out = { scrapedAt: new Date().toISOString(), source: BRAND, categories, products };
await writeFile(new URL("./seed.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(`\nTOTAL products: ${products.length}, categories: ${categories.length}`);
console.log("Categories:", categories.map((c) => c.name).join(" | "));
