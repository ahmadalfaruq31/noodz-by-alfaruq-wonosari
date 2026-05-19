import { useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";

// ─── Config ──────────────────────────────────────────────────────────────────
const TOTAL   = 240;
const PAD     = 3;
const BASE    = "/sequence/ezgif-frame-";
const EXT     = ".jpg";

function src(i: number) {
  return `${BASE}${String(i).padStart(PAD, "0")}${EXT}`;
}

// ─── Object-fit COVER via source-crop ────────────────────────────────────────
// Uses the 9-argument drawImage so the browser blits only the visible portion
// of the source image, filling the canvas exactly — zero black bars on any
// screen size or orientation.
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,   // canvas pixel width  (device pixels)
  ch: number    // canvas pixel height (device pixels)
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;

  // Scale so the image covers the canvas (same math as object-fit:cover)
  const scale = Math.max(cw / iw, ch / ih);

  // Scaled image dimensions
  const sw = iw * scale;
  const sh = ih * scale;

  // Where the image would sit if centred over the canvas
  const ox = (cw - sw) / 2;
  const oy = (ch - sh) / 2;

  ctx.clearRect(0, 0, cw, ch);

  // If the scaled image is exactly the canvas size, skip the 9-arg form
  if (ox === 0 && oy === 0) {
    ctx.drawImage(img, 0, 0, cw, ch);
    return;
  }

  // Source crop: which rectangle of the original image maps to the full canvas
  const srcX = -ox / scale;
  const srcY = -oy / scale;
  const srcW =  cw  / scale;
  const srcH =  ch  / scale;

  ctx.drawImage(
    img,
    srcX, srcY, srcW, srcH,   // source crop
    0,    0,    cw,   ch      // destination = full canvas
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  // Image store — plain refs, never trigger re-renders
  const imgs    = useRef<HTMLImageElement[]>(new Array(TOTAL));
  const ready   = useRef<boolean[]>(new Array(TOTAL).fill(false));

  // Render state
  const target    = useRef(0);   // desired frame index (0-based)
  const drawn     = useRef(-1);  // last frame actually painted
  const rafHandle = useRef<number | null>(null);

  // ── Scroll ────────────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    target.current = Math.min(TOTAL - 1, Math.max(0, Math.round(p * (TOTAL - 1))));
  });

  // ── Canvas resize — ONLY sets pixel dimensions, NO ctx transforms ─────────
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    // Assigning width/height resets the canvas AND clears all previous
    // transforms — safe to do here without accumulation risk.
    canvas.width  = Math.round(canvas.offsetWidth  * dpr);
    canvas.height = Math.round(canvas.offsetHeight * dpr);
    drawn.current = -1; // force repaint after resize
  }, []);

  // ── Paint loop — runs every rAF, repaints only when necessary ─────────────
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) { rafHandle.current = requestAnimationFrame(loop); return; }

    const ctx = canvas.getContext("2d");
    if (!ctx)  { rafHandle.current = requestAnimationFrame(loop); return; }

    const want = target.current;

    if (want !== drawn.current) {
      // Find best available frame — target first, then search outward
      let idx = want;

      if (!ready.current[idx]) {
        let found = false;
        for (let d = 1; d < TOTAL; d++) {
          const lo = idx - d;
          const hi = idx + d;
          if (lo >= 0    && ready.current[lo]) { idx = lo; found = true; break; }
          if (hi < TOTAL && ready.current[hi]) { idx = hi; found = true; break; }
        }
        if (!found) {
          rafHandle.current = requestAnimationFrame(loop);
          return; // nothing loaded yet — keep canvas as-is (background colour)
        }
      }

      drawCover(ctx, imgs.current[idx], canvas.width, canvas.height);
      drawn.current = want; // record intent, not the fallback idx
    }

    rafHandle.current = requestAnimationFrame(loop);
  }, []);

  // ── Mount / unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    // Initial size
    resize();

    // Watch for viewport changes (orientation, resize, mobile URL-bar)
    const ro = new ResizeObserver(resize);
    if (canvasRef.current) ro.observe(canvasRef.current);

    // Start render loop
    rafHandle.current = requestAnimationFrame(loop);

    // ── Preload all 240 images ────────────────────────────────────────────
    // Frame 0 is loaded first (synchronously queued) so it renders fast;
    // the rest are loaded in order via a queue to avoid memory spikes.
    const store   = imgs.current;
    const isReady = ready.current;

    function loadOne(i: number) {
      const img   = new Image();
      img.decoding = "async";
      img.onload  = () => {
        isReady[i] = true;
        // Force repaint when any early frame loads
        if (drawn.current < 0) drawn.current = -1;
      };
      img.src     = src(i + 1);   // files are 1-indexed
      store[i]    = img;
    }

    // Load first frame immediately
    loadOne(0);

    // Queue the rest in a microtask to not block first paint
    let queued = 1;
    const next = () => {
      if (queued >= TOTAL) return;
      loadOne(queued);
      queued++;
      // Use MessageChannel (faster than setTimeout 0) to yield to the browser
      const mc = new MessageChannel();
      mc.port1.onmessage = next;
      mc.port2.postMessage(null);
    };
    // Start queuing after first frame request finishes
    const mc = new MessageChannel();
    mc.port1.onmessage = next;
    mc.port2.postMessage(null);

    return () => {
      ro.disconnect();
      if (rafHandle.current !== null) cancelAnimationFrame(rafHandle.current);
    };
  }, [loop, resize]);

  // ── Text / overlay motion values ──────────────────────────────────────────
  const text1Opacity   = useTransform(scrollYProgress, [0, 0.22, 0.32], [1, 1, 0]);

  const text2Opacity   = useTransform(scrollYProgress, [0.32, 0.42, 0.55, 0.65], [0, 1, 1, 0]);
  const text2Y         = useTransform(scrollYProgress, [0.32, 0.42], [28, 0]);

  const text3Opacity   = useTransform(scrollYProgress, [0.65, 0.74, 0.88, 0.97], [0, 1, 1, 0]);
  const text3Y         = useTransform(scrollYProgress, [0.65, 0.74], [28, 0]);

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.9, 1],
    [0.5, 0.26, 0.26, 0.6]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="h-[400vh] w-full relative">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-background">

        {/* Canvas — pixel dimensions set in JS, CSS just stretches it to fill */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }}
        />

        {/* Scrim — keeps text readable over any frame */}
        <motion.div
          className="absolute inset-0 z-10 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        {/* Text overlays */}
        <div className="absolute inset-0 z-20 pointer-events-none">

          {/* Phase 1 — SLURP IT HOT */}
          <motion.div
            style={{ opacity: text1Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
          >
            <p className="font-sans text-xs tracking-[0.5em] text-primary mb-4 uppercase">
              서울 탄생
            </p>
            <h1 className="font-display text-7xl md:text-[10rem] text-foreground leading-none tracking-tight drop-shadow-2xl">
              SLURP<br />IT HOT
            </h1>
          </motion.div>

          {/* Phase 2 — SPICY GOCHUJANG BLISS */}
          <motion.div
            style={{ opacity: text2Opacity, y: text2Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
          >
            <p className="font-sans text-xs tracking-[0.5em] text-secondary mb-4 uppercase">
              고추장 블리스
            </p>
            <h1
              className="font-display text-6xl md:text-[9rem] leading-none tracking-tight drop-shadow-2xl"
              style={{
                color: "hsl(var(--primary))",
                textShadow: "0 0 60px hsl(var(--primary) / 0.5)",
              }}
            >
              SPICY<br />GOCHUJANG<br />BLISS
            </h1>
          </motion.div>

          {/* Phase 3 — BORN IN SEOUL */}
          <motion.div
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
          >
            <p className="font-sans text-[10px] tracking-[0.5em] text-foreground/50 mb-4 uppercase">
              대한민국
            </p>
            <h1 className="font-display text-7xl md:text-[10rem] text-foreground leading-none tracking-tight drop-shadow-2xl">
              BORN<br />IN SEOUL
            </h1>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
          <motion.p
            className="font-sans text-[10px] tracking-[0.4em] text-foreground/40 uppercase"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Scroll
          </motion.p>
          <motion.div
            className="w-px bg-foreground/30"
            animate={{ height: ["12px", "28px", "12px"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
