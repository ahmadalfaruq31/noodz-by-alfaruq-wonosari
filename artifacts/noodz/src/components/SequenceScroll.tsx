import { useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";

const FRAME_COUNT = 240;

function frameSrc(i: number) {
  return `/sequence/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;
}

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Store images in a plain array (not state) to avoid re-renders
  const images = useRef<HTMLImageElement[]>([]);
  const loaded = useRef<boolean[]>(new Array(FRAME_COUNT).fill(false));
  const targetFrame = useRef(0);
  const rafId = useRef<number | null>(null);
  const needsPaint = useRef(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ─── Draw a single frame onto the canvas ──────────────────────────────────
  const paint = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resolve to nearest loaded frame (search backwards then forwards)
    let idx = frameIdx;
    if (!loaded.current[idx]) {
      let found = false;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (idx - d >= 0 && loaded.current[idx - d]) { idx = idx - d; found = true; break; }
        if (idx + d < FRAME_COUNT && loaded.current[idx + d]) { idx = idx + d; found = true; break; }
      }
      if (!found) return; // Nothing loaded yet — keep black
    }

    const img = images.current[idx];
    if (!img) return;

    // Canvas pixel dimensions (already in device pixels — no ctx transform applied)
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;

    // object-fit: cover math
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // ─── RAF loop — only repaints when something changed ─────────────────────
  const loop = useCallback(() => {
    if (needsPaint.current) {
      paint(targetFrame.current);
      needsPaint.current = false;
    }
    rafId.current = requestAnimationFrame(loop);
  }, [paint]);

  // ─── Canvas resize — sets device-pixel dimensions, NO ctx.scale ──────────
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    // Setting width/height resets the canvas and clears any prior transform
    canvas.width = Math.round(canvas.offsetWidth * dpr);
    canvas.height = Math.round(canvas.offsetHeight * dpr);
    needsPaint.current = true; // Repaint after resize
  }, []);

  // ─── Boot: resize → start RAF loop → kick off image preload ──────────────
  useEffect(() => {
    resize();

    const ro = new ResizeObserver(resize);
    if (canvasRef.current) ro.observe(canvasRef.current);

    rafId.current = requestAnimationFrame(loop);

    // Preload all frames; prioritise first frame so canvas isn't black on load
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(i + 1);
      img.onload = () => {
        loaded.current[i] = true;
        images.current[i] = img;
        // Repaint whenever any frame loads so canvas fills in progressively
        needsPaint.current = true;
      };
      images.current[i] = img;
    }

    return () => {
      ro.disconnect();
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [loop, resize]);

  // ─── Map scroll → frame index ─────────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(progress * (FRAME_COUNT - 1)))
    );
    if (next !== targetFrame.current) {
      targetFrame.current = next;
      needsPaint.current = true;
    }
  });

  // ─── Text / overlay animations ────────────────────────────────────────────
  const text1Opacity = useTransform(scrollYProgress, [0, 0.22, 0.32], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.32, 0.42, 0.55, 0.65], [0, 1, 1, 0]);
  const text2Y      = useTransform(scrollYProgress, [0.32, 0.42], [30, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.65, 0.74, 0.88, 0.97], [0, 1, 1, 0]);
  const text3Y      = useTransform(scrollYProgress, [0.65, 0.74], [30, 0]);
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [0.5, 0.28, 0.28, 0.6]
  );

  return (
    <div ref={containerRef} className="h-[400vh] w-full relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">

        {/* Canvas — fills viewport, draws in device pixels */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }}
        />

        {/* Dark overlay for text legibility */}
        <motion.div
          className="absolute inset-0 z-10 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        {/* Text overlays */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">

          {/* Phase 1 */}
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

          {/* Phase 2 */}
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

          {/* Phase 3 */}
          <motion.div
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
          >
            <p className="font-sans text-xs tracking-[0.5em] text-foreground/60 mb-4 uppercase">
              대한민국
            </p>
            <h1 className="font-display text-7xl md:text-[10rem] text-foreground leading-none tracking-tight drop-shadow-2xl">
              BORN<br />IN SEOUL
            </h1>
          </motion.div>
        </div>

        {/* Scroll indicator */}
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
