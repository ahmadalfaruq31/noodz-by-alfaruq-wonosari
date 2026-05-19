import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function VideoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const gradientOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.2]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3], [0, 1, 1, 0]);
  const text1Scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1.2]);
  
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.5, 0.6], [0, 1, 1, 0]);
  const text2Scale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1.2]);
  
  const text3Opacity = useTransform(scrollYProgress, [0.6, 0.7, 0.8, 0.9], [0, 1, 1, 0]);
  const text3Scale = useTransform(scrollYProgress, [0.6, 0.8], [0.8, 1.2]);

  return (
    <div ref={containerRef} className="h-[400vh] w-full relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            opacity: gradientOpacity,
            y: backgroundY,
            background: "radial-gradient(circle at 50% 50%, hsl(var(--primary)) 0%, hsl(var(--secondary)) 40%, hsl(var(--background)) 80%)",
            filter: "blur(60px) saturate(200%)"
          }}
        />
        
        <div className="absolute inset-0 z-10 bg-black/40 mix-blend-multiply" />
        
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <motion.h1 
            style={{ opacity: text1Opacity, scale: text1Scale }}
            className="absolute text-7xl md:text-9xl font-display text-foreground tracking-tight text-center px-4"
          >
            SLURP IT HOT
          </motion.h1>
          
          <motion.h1 
            style={{ opacity: text2Opacity, scale: text2Scale }}
            className="absolute text-7xl md:text-9xl font-display text-primary tracking-tight text-center px-4 mix-blend-screen drop-shadow-lg"
          >
            SPICY GOCHUJANG BLISS
          </motion.h1>
          
          <motion.h1 
            style={{ opacity: text3Opacity, scale: text3Scale }}
            className="absolute text-7xl md:text-9xl font-display text-foreground tracking-tight text-center px-4"
          >
            BORN IN SEOUL
          </motion.h1>
        </div>
      </div>
    </div>
  );
}
