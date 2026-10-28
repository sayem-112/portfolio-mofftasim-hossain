// A photo printed as 1-bit pixels: it arrives as static, settles into an Atkinson dither,
// and a slow shimmer of static follows the cursor across it. It changes only when asked to.

interface Photo {
  src: string;
  caption: string;
}

const INK: [number, number, number] = [236, 236, 232];
// The page colour (--bg), so the frame has no visible edge.
const PAPER: [number, number, number] = [9, 9, 11];

function atkinson(lum: Float32Array, w: number, h: number) {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const on = lum[i] > 0.5 ? 1 : 0;
      out[i] = on;
      const err = (lum[i] - on) / 8;
      if (x + 1 < w) lum[i + 1] += err;
      if (x + 2 < w) lum[i + 2] += err;
      if (y + 1 < h) {
        if (x > 0) lum[i + w - 1] += err;
        lum[i + w] += err;
        if (x + 1 < w) lum[i + w + 1] += err;
      }
      if (y + 2 < h) lum[i + 2 * w] += err;
    }
  }
  return out;
}

// Cheap stable hash: the same pixel and tick always give the same static.
function noise(x: number, y: number, t: number) {
  let n = (x * 374761393 + y * 668265263 + t * 2147483647) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

const cache = new Map<string, Promise<HTMLImageElement>>();
function load(src: string) {
  if (!cache.has(src)) {
    cache.set(
      src,
      new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      }),
    );
  }
  return cache.get(src)!;
}

export function mountDither(root: HTMLElement, photos: Photo[]) {
  const canvas = root.querySelector<HTMLCanvasElement>("canvas")!;
  const caption = root.querySelector<HTMLElement>("[data-caption]")!;
  const count = root.querySelector<HTMLElement>("[data-count]")!;
  const prev = root.querySelector<HTMLButtonElement>("[data-prev]")!;
  const next = root.querySelector<HTMLButtonElement>("[data-next]")!;
  const ctx = canvas.getContext("2d")!;
  const still = matchMedia("(prefers-reduced-motion: reduce)");

  let w = 0, h = 0;
  let target = new Uint8Array(0);
  let shown = new Uint8Array(0);
  let image: ImageData | null = null;
  let index = 0;
  let settleFrom = 0; // when the current photo started resolving
  let pointer: { x: number; y: number } | null = null;
  let raf = 0, visible = true;

  const size = () => {
    const cssW = canvas.clientWidth || 640;
    // Two CSS pixels per dot keeps the dither chunky enough to read as a print, not a photo.
    w = Math.max(160, Math.round(cssW / 2));
    // Follow the plate's own shape, which changes between phone and desktop.
    h = Math.round(w * ((canvas.clientHeight || 1) / (canvas.clientWidth || 2)));
    canvas.width = w;
    canvas.height = h;
    image = ctx.createImageData(w, h);
    shown = new Uint8Array(w * h);
  };

  const prepare = async (n: number) => {
    const photo = photos[n];
    const img = await load(photo.src);
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const o = off.getContext("2d", { willReadFrequently: true })!;
    // Cover-fit, then lift contrast so the dither keeps its shapes.
    const r = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * r, dh = img.naturalHeight * r;
    o.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    const px = o.getImageData(0, 0, w, h).data;
    const lum = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const l = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255;
      lum[i] = Math.min(1, Math.max(0, (l - 0.5) * 1.25 + 0.52));
    }
    // Keep every photo mostly dark, like the page: bright skies would otherwise print as a white slab.
    let mean = 0;
    for (let i = 0; i < lum.length; i++) mean += lum[i];
    mean /= lum.length;
    if (mean > 0.3) {
      const g = Math.log(0.3) / Math.log(mean);
      for (let i = 0; i < lum.length; i++) lum[i] = Math.pow(lum[i], g);
    }
    // Cap highlights so lit surfaces keep a little grain instead of printing as solid white.
    for (let i = 0; i < lum.length; i++) lum[i] = Math.min(lum[i], 0.86);
    return atkinson(lum, w, h);
  };

  const paint = () => {
    if (!image) return;
    const d = image.data;
    for (let i = 0; i < shown.length; i++) {
      const p = i * 4;
      const c = shown[i] ? INK : PAPER;
      d[p] = c[0];
      d[p + 1] = c[1];
      d[p + 2] = c[2];
      d[p + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  };

  const step = (now: number) => {
    raf = 0;
    if (!visible) return;
    const t = Math.min(1, (now - settleFrom) / 1100);
    const settle = 1 - Math.pow(1 - t, 3);
    let busy = t < 1;
    const r2 = 16 * 16;
    // The lens re-rolls its static a few times a second, not every frame, so it shimmers instead of flickering.
    const tick = Math.floor(now / 140);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        let lensed = false;
        if (pointer) {
          const dx = x - pointer.x, dy = y - pointer.y;
          lensed = dx * dx + dy * dy < r2;
        }
        if (lensed) shown[i] = noise(x, y, tick) < 0.32 ? 1 : 0;
        else if (Math.random() > settle) shown[i] = Math.random() < 0.32 ? 1 : 0;
        else shown[i] = target[i];
      }
    }
    if (pointer) busy = true;
    paint();
    if (busy) raf = requestAnimationFrame(step);
  };

  const kick = () => {
    if (!raf && !still.matches) raf = requestAnimationFrame(step);
  };

  const show = async (n: number) => {
    index = (n + photos.length) % photos.length;
    caption.textContent = photos[index].caption;
    count.textContent = `${index + 1}/${photos.length}`;
    try {
      target = await prepare(index);
    } catch {
      return;
    }
    if (still.matches) {
      shown = target.slice();
      paint();
      return;
    }
    settleFrom = performance.now();
    kick();
    // Warm the next photo so the following switch is instant.
    load(photos[(index + 1) % photos.length].src).catch(() => {});
  };

  canvas.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || still.matches) return;
    const r = canvas.getBoundingClientRect();
    pointer = { x: ((e.clientX - r.left) / r.width) * w, y: ((e.clientY - r.top) / r.height) * h };
    kick();
  });
  canvas.addEventListener("pointerleave", () => {
    pointer = null;
    kick();
  });
  canvas.addEventListener("click", () => show(index + 1));
  next.addEventListener("click", () => show(index + 1));
  prev.addEventListener("click", () => show(index - 1));

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) kick();
  }).observe(root);

  let lastW = 0;
  new ResizeObserver(() => {
    if (Math.abs(canvas.clientWidth - lastW) < 8) return;
    lastW = canvas.clientWidth;
    size();
    show(index);
  }).observe(canvas);
}
