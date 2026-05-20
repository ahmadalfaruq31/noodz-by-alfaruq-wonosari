import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [linesDone, setLinesDone] = useState(false);

  useEffect(() => {
    // After lines animate in, trigger exit
    const t1 = setTimeout(() => setLinesDone(true), 1400);
    const t2 = setTimeout(() => setVisible(false), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "#0a0a0a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            overflow: "hidden",
          }}
        >
          {/* Top rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: linesDone ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: linesDone ? 0 : 0 }}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 1,
              background: "hsl(0 72% 51% / 0.35)",
              transformOrigin: "left",
              transform: "translateY(-52px)",
            }}
          />

          {/* Bottom rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: linesDone ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: linesDone ? 0 : 0.08 }}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 1,
              background: "hsl(0 72% 51% / 0.35)",
              transformOrigin: "right",
              transform: "translateY(52px)",
            }}
          />

          {/* NOODZ wordmark */}
          <div style={{ overflow: "hidden", lineHeight: 1 }}>
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: linesDone ? "-110%" : "0%" }}
              transition={{
                y: {
                  duration: linesDone ? 0.45 : 0.65,
                  ease: [0.76, 0, 0.24, 1],
                  delay: linesDone ? 0 : 0.1,
                },
              }}
              style={{
                fontFamily: "var(--app-font-display), sans-serif",
                fontSize: "clamp(72px, 14vw, 160px)",
                letterSpacing: "0.08em",
                color: "#FAEDCD",
                margin: 0,
                lineHeight: 1,
              }}
            >
              NOODZ
            </motion.h1>
          </div>

          {/* by Alfaruq */}
          <div style={{ overflow: "hidden", lineHeight: 1 }}>
            <motion.p
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: linesDone ? "-110%" : "0%", opacity: linesDone ? 0 : 1 }}
              transition={{
                y: {
                  duration: linesDone ? 0.4 : 0.55,
                  ease: [0.76, 0, 0.24, 1],
                  delay: linesDone ? 0.04 : 0.22,
                },
                opacity: { duration: 0.4, delay: linesDone ? 0 : 0.22 },
              }}
              style={{
                fontFamily: "var(--app-font-sans), sans-serif",
                fontSize: "clamp(10px, 1.1vw, 13px)",
                letterSpacing: "0.45em",
                color: "hsl(0 72% 51% / 0.9)",
                textTransform: "uppercase",
                margin: "10px 0 0",
                lineHeight: 1,
              }}
            >
              by Alfaruq
            </motion.p>
          </div>

          {/* Loading bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: linesDone ? 1 : 1 }}
            transition={{ duration: 1.2, ease: "linear" }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 2,
              width: "100%",
              background: "hsl(0 72% 51% / 0.6)",
              transformOrigin: "left",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
