// Neutral on-brand placeholder shown when a product/category image is missing
// or fails to load (e.g. an image hosted on an unreachable origin).
export const FALLBACK_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'>
       <rect width='320' height='320' fill='#fbf8f2'/>
       <g fill='none' stroke='#c2a14d' stroke-width='2' opacity='0.55'>
         <rect x='118' y='118' width='84' height='84'/>
         <rect x='118' y='118' width='84' height='84' transform='rotate(45 160 160)'/>
       </g>
       <text x='160' y='232' text-anchor='middle' font-family='Tajawal, sans-serif'
             font-size='16' fill='#a99b86'>المرحومي</text>
     </svg>`
  );

// Attach to an <img> onError to swap to the fallback exactly once.
export const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.dataset.fallback === "1") return;
  img.dataset.fallback = "1";
  img.src = FALLBACK_IMAGE;
};
