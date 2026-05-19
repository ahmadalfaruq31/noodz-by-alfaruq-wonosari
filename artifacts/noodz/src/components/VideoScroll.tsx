import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";

export default function VideoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    if (video.readyState >= 1) handleMetadata();

    return () => video.removeEventListener("loadedmetadata", handleMetadata);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const targetTime = latest * duration;
    if (Math.abs(video.currentTime - targetTime) > 0.05) {
      video.currentTime = targetTime;
    }
  });

  const text1Opacity = useTransform(scrollYProgress, [0, 0.22, 0.32], [1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.08], [0, 0]);

  const text2Opacity = useTransform(scrollYProgress, [0.32, 0.42, 0.55, 0.65], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.32, 0.42], [30, 0]);

  const text3Opacity = useTransform(scrollYProgress, [0.65, 0.74, 0.88, 0.97], [0, 1, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.65, 0.74], [30, 0]);

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0.6, 0.35, 0.35, 0.7]);

  return (
    <div ref={containerRef} className="h-[400vh] w-full relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/ramen.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />

        <motion.div
          className="absolute inset-0 z-10 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <motion.div
            style={{ opacity: text1Opacity, y: text1Y }}
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
