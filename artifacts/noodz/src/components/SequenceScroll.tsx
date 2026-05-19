import { useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";

// ─── Config ──────────────────────────────────────────────────────────────────
const TOTAL = 240;
const BASE  = "/sequence/ezgif-frame-";

function frameSrc(i: number) {
  return `${BASE}${String(i + 1).padStart(3, "0")}.jpg`;
}

// ─── Exact cover math (user-specified) ───────────────────────────────────────
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  if (!img.naturalWidth || !img.naturalHeight) return;

  const imageRatio  = img.width  / img.height;
  const canvasRatio = cw / ch;
  let sX: number, sY: number, sWidth: number, sHeight: number;

  if (canvasRatio > imageRatio) {
    sWidth  = img.width;
    sHeight = img.width / canvasRatio;
    sX      = 0;
    sY      = (img.height - sHeight) / 2;
  } else {
    sWidth  = img.height * canvasRatio;
    sHeight = img.height;
    sX      = (img.width - sWidth) / 2;
    sY      = 0;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, sX, sY, sWidth, sHeight, 0, 0, cw, ch);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  // Plain div ref — no Framer Motion style ownership, DOM mutations work reliably
  const wrapRef      = useRef<HTMLDivElement>(null);

  const imgs  = useRef<HTMLImageElement[]>(new Array(TOTAL));
  const ready = useRef<boolean[]>(new Array(TOTAL).fill(false));

  const target    = useRef(0);
  const drawn     = useRef(-1);
  const rafHandle = useRef<number | null>(null);

  // ── Scroll ────────────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    target.current = Math.min(TOTAL - 1, Math.max(0, Math.round(p * (TOTAL - 1))));
  });

  // Hero fade-out: becomes invisible after 92% of scroll so sections cover it cleanly
  const heroFade   = useTransform(scrollYProgress, [0.92, 1], [1, 0]);

  // Direct DOM update for hero opacity — no React re-renders, no Motion ownership
  useMotionValueEvent(heroFade, "change", (v) => {
    if (wrapRef.current) wrapRef.current.style.opacity = String(v);
  });

  // Text/scrim transforms
  const text1Opacity   = useTransform(scrollYProgress, [0,    0.22, 0.32], [1, 1, 0]);
  const text2Opacity   = useTransform(scrollYProgress, [0.32, 0.42, 0.55, 0.65], [0, 1, 1, 0]);
  const text2Y         = useTransform(scrollYProgress, [0.32, 0.42], [28, 0]);
  const text3Opacity   = useTransform(scrollYProgress, [0.65, 0.74, 0.88, 0.97], [0, 1, 1, 0]);
  const text3Y         = useTransform(scrollYProgress, [0.65, 0.74], [28, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0.48, 0.25, 0.25, 0.58]);

  // Cinematic blur-to-black overlay — triggered exactly when Phase 3 / "Every bowl…" fades in.
  // Eases from fully transparent to bg-black/90 + 12px blur over the same range as text3's entrance.
  const cineBlackOpacity = useTransform(scrollYProgress, [0.65, 0.84], [0, 0.9]);
  const cineBlurRaw      = useTransform(scrollYProgress, [0.65, 0.84], [0, 12]);
  const cineBlurFilter   = useTransform(cineBlurRaw, (v) => `blur(${v.toFixed(2)}px)`);

  // ── Canvas resize ─────────────────────────────────────────────────────────
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    // Assigning .width/.height resets the 2D context to identity — safe, no accumulation
    canvas.width  = Math.round(window.innerWidth  * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    drawn.current = -1;
  }, []);

  // ── RAF paint loop — all refs, zero React state, one allocation at mount ──
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const want = target.current;
        if (want !== drawn.current) {
          let idx   = want;
          let found = ready.current[idx];

          if (!found) {
            for (let d = 1; d < TOTAL; d++) {
              if (idx - d >= 0    && ready.current[idx - d]) { idx = idx - d; found = true; break; }
              if (idx + d < TOTAL && ready.current[idx + d]) { idx = idx + d; found = true; break; }
            }
          }

          if (found) {
            drawCover(ctx, imgs.current[idx], canvas.width, canvas.height);
            drawn.current = want;
          }
        }
      }
    }
    rafHandle.current = requestAnimationFrame(loop);
  }, []); // stable — only refs inside

  // ── Mount / unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    resize();
    window.addEventListener("resize",            resize, { passive: true });
    window.addEventListener("orientationchange", resize, { passive: true });
    rafHandle.current = requestAnimationFrame(loop);

    const store   = imgs.current;
    const isReady = ready.current;

    function loadOne(i: number) {
      const img    = new Image();
      img.decoding = "async";
      img.onload   = () => { isReady[i] = true; };
      img.src      = frameSrc(i);
      store[i]     = img;
    }

    loadOne(0);

    let queued = 1;
    function scheduleNext() {
      if (queued >= TOTAL) return;
      loadOne(queued++);
      const mc = new MessageChannel();
      mc.port1.onmessage = scheduleNext;
      mc.port2.postMessage(null);
    }
    const mc = new MessageChannel();
    mc.port1.onmessage = scheduleNext;
    mc.port2.postMessage(null);

    return () => {
      window.removeEventListener("resize",            resize);
      window.removeEventListener("orientationchange", resize);
      if (rafHandle.current !== null) cancelAnimationFrame(rafHandle.current);
    };
  }, [loop, resize]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    // Scroll-distance anchor — transparent, no visual
    <div ref={containerRef} style={{ height: "400vh", width: "100%", position: "relative" }}>

      {/*
        Plain div (NOT motion.div) — we mutate style.opacity directly via
        useMotionValueEvent so Framer Motion never owns this element's styles.
        Fixed to exact viewport bounds: no margins, no CSS h-screen quirks.
      */}
      <div
        ref={wrapRef}
        style={{
          position:   "fixed",
          top:        0,
          left:       0,
          width:      "100vw",
          height:     "100vh",
          zIndex:     1,
          overflow:   "hidden",
          background: "#000000",
          opacity:    1,
        }}
      >
        {/* Canvas — pixel dims set by JS; CSS fills the wrapper exactly */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            display: "block",
          }}
        />

        {/* Scrim — keeps text readable over any frame */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background: "#000000",
            opacity: overlayOpacity,
          }}
        />

        {/*
          Cinematic blur-to-black overlay — sits above scrim, below text.
          Triggers exactly when "Every bowl of Noodz…" / Phase 3 fades in.
          Interpolates backdrop-blur 0→12px AND bg-black opacity 0→0.9
          over the same scroll range as text3's entrance for a perfectly
          synchronized, organic transition with no hard cuts.
        */}
        <motion.div
          style={{
            position:            "absolute",
            inset:               0,
            zIndex:              3,
            background:          "#000000",
            opacity:             cineBlackOpacity,
            backdropFilter:      cineBlurFilter,
            WebkitBackdropFilter: cineBlurFilter,
            pointerEvents:       "none",
          }}
        />

        {/* Text overlays — above canvas, scrim, and cinematic overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>

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
              style={{ color: "hsl(var(--primary))", textShadow: "0 0 60px hsl(var(--primary) / 0.5)" }}
            >
              SPICY<br />GOCHUJANG<br />BLISS
            </h1>
          </motion.div>

          {/* Phase 3 — BORN IN SEOUL + "Every bowl of Noodz…" */}
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
            <p className="font-sans text-sm md:text-base text-foreground/70 mt-6 max-w-sm leading-relaxed">
              Every bowl of Noodz is a story — fire, soul, and 36 hours of broth.
            </p>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div
          style={{
            position: "absolute",
            bottom: 32, left: "50%",
            transform: "translateX(-50%)",
            zIndex: 4,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            pointerEvents: "none",
          }}
        >
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
