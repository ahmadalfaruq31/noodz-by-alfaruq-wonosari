import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";

export default function VideoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const durationRef  = useRef(0);
  const lastTimeRef  = useRef(-1);
  const readyRef     = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prime = () => {
      if (readyRef.current) return;
      readyRef.current  = true;
      durationRef.current = video.duration;

      // Play-then-pause trick — forces the browser to decode & show frame 0
      const p = video.play();
      if (p !== undefined) {
        p.then(() => {
          video.pause();
          video.currentTime = 0;
        }).catch(() => {
          // Autoplay blocked (unlikely since muted) — still set time
          video.currentTime = 0;
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    };

    // canplaythrough = enough data buffered; fire prime as soon as possible
    if (video.readyState >= 3) {
      prime();
    } else {
      video.addEventListener("canplay", prime, { once: true });
    }

    // Prevent accidental re-play by browser after seeking
    const keepPaused = () => {
      if (readyRef.current) video.pause();
    };
    video.addEventListener("play", keepPaused);

    return () => {
      video.removeEventListener("canplay", prime);
      video.removeEventListener("play", keepPaused);
    };
  }, []);

  // Map scroll progress → video.currentTime
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const video    = videoRef.current;
    const duration = durationRef.current;
    if (!video || !duration) return;

    const target = Math.min(duration, Math.max(0, progress * duration));
    // Skip seek if within one 30-fps frame — avoids jank on tiny scroll events
    if (Math.abs(target - lastTimeRef.current) < 0.033) return;
    lastTimeRef.current = target;
    video.currentTime   = target;
  });

  // ── Overlay / text transforms ────────────────────────────────────────────
  const text1Opacity = useTransform(scrollYProgress, [0, 0.22, 0.32], [1, 1, 0]);

  const text2Opacity = useTransform(scrollYProgress, [0.32, 0.42, 0.55, 0.65], [0, 1, 1, 0]);
  const text2Y       = useTransform(scrollYProgress, [0.32, 0.42], [28, 0]);

  const text3Opacity = useTransform(scrollYProgress, [0.65, 0.74, 0.88, 0.97], [0, 1, 1, 0]);
  const text3Y       = useTransform(scrollYProgress, [0.65, 0.74], [28, 0]);

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.9, 1],
    [0.5, 0.26, 0.26, 0.6]
  );

  return (
    <div ref={containerRef} className="h-[400vh] w-full relative">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-background">

        {/* ── Video — covers viewport, no black bars ───────────────────── */}
        <video
          ref={videoRef}
          src="/1000256540.mp4"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover" }}
          muted
          playsInline
          loop={false}
          preload="auto"
        />

        {/* Scrim */}
        <motion.div
          className="absolute inset-0 z-10 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        {/* ── Text overlays ────────────────────────────────────────────── */}
        <div className="absolute inset-0 z-20 pointer-events-none">

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
