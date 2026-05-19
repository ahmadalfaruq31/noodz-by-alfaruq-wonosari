import { useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";

const FRAME_COUNT = 240;
const BASE_PATH = "/sequence/";

function frameSrc(i: number) {
  return `${BASE_PATH}ezgif-frame-${String(i).padStart(3, "0")}.jpg`;
}

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const loadedRef = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const dirtyRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = framesRef.current[index];
    if (!img || !loadedRef.current[index]) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  const renderLoop = useCallback(() => {
    if (dirtyRef.current) {
      drawFrame(currentFrameRef.current);
      dirtyRef.current = false;
    }
    rafRef.current = requestAnimationFrame(renderLoop);
  }, [drawFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      dirtyRef.current = true;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    rafRef.current = requestAnimationFrame(renderLoop);

    const frames = framesRef.current;
    const loaded = loadedRef.current;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameSrc(i + 1);
      img.onload = () => {
        loaded[i] = true;
        frames[i] = img;
        if (i === 0) {
          currentFrameRef.current = 0;
          dirtyRef.current = true;
        }
      };
      frames[i] = img;
    }

    return () => {
      ro.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [renderLoop]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.round(latest * (FRAME_COUNT - 1)))
    );
    if (index !== currentFrameRef.current) {
      currentFrameRef.current = index;
      dirtyRef.current = true;
    }
  });

  const text1Opacity = useTransform(scrollYProgress, [0, 0.22, 0.32], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.32, 0.42, 0.55, 0.65], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.32, 0.42], [30, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.65, 0.74, 0.88, 0.97], [0, 1, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.65, 0.74], [30, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0.55, 0.3, 0.3, 0.65]);

  return (
    <div ref={containerRef} className="h-[400vh] w-full relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }}
        />

        <motion.div
          className="absolute inset-0 z-10 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <motion.div
            style={{ opacity: text1Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
          >
            <p className="font-sans text-xs tracking-[0.5em] text-primary mb-4 uppercase">서울 탄생</p>
            <h1 className="font-display text-7xl md:text-[10rem] text-foreground leading-none tracking-tight drop-shadow-2xl">
              SLURP<br />IT HOT
            </h1>
          </motion.div>

          <motion.div
            style={{ opacity: text2Opacity, y: text2Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
          >
            <p className="font-sans text-xs tracking-[0.5em] text-secondary mb-4 uppercase">고추장 블리스</p>
            <h1
              className="font-display text-6xl md:text-[9rem] leading-none tracking-tight drop-shadow-2xl"
              style={{ color: "hsl(var(--primary))", textShadow: "0 0 60px hsl(var(--primary) / 0.5)" }}
            >
              SPICY<br />GOCHUJANG<br />BLISS
            </h1>
          </motion.div>

          <motion.div
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
          >
            <p className="font-sans text-xs tracking-[0.5em] text-foreground/60 mb-4 uppercase">대한민국</p>
            <h1 className="font-display text-7xl md:text-[10rem] text-foreground leading-none tracking-tight drop-shadow-2xl">
              BORN<br />IN SEOUL
            </h1>
          </motion.div>
        </div>

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
