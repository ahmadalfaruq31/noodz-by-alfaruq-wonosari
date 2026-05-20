import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const LETTERS = ["N", "O", "O", "D", "Z"];

export default function SplashScreen() {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("out"), 1800);
    const t2 = setTimeout(() => setVisible(false), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "#080808",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Letter-by-letter wordmark */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.04em" }}>
            {LETTERS.map((letter, i) => (
              <div key={i} style={{ overflow: "hidden", lineHeight: 0.85 }}>
                <motion.span
                  initial={{ y: "105%", opacity: 0 }}
                  animate={
                    phase === "out"
                      ? { y: "-105%", opacity: 0 }
                      : { y: "0%", opacity: 1 }
                  }
                  transition={{
                    y: {
                      duration: phase === "out" ? 0.55 : 0.7,
                      ease: [0.76, 0, 0.24, 1],
                      delay: phase === "out"
                        ? (LETTERS.length - 1 - i) * 0.04
                        : i * 0.07,
                    },
                    opacity: {
                      duration: 0.01,
                      delay: phase === "out" ? 0 : i * 0.07,
                    },
                  }}
                  style={{
                    display: "block",
                    fontFamily: "var(--app-font-display), sans-serif",
                    fontSize: "clamp(80px, 15vw, 168px)",
                    letterSpacing: "0.06em",
                    color: "#FAEDCD",
                    lineHeight: 0.85,
                  }}
                >
                  {letter}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Subtitle — expands letter-spacing on entry */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={
              phase === "out"
                ? { opacity: 0, letterSpacing: "0.8em" }
                : { opacity: 0.55, letterSpacing: "0.45em" }
            }
            transition={{
              opacity: { duration: 0.6, delay: phase === "out" ? 0 : 0.55 },
              letterSpacing: { duration: phase === "out" ? 0.5 : 0.8, ease: "easeOut", delay: phase === "out" ? 0 : 0.5 },
            }}
            style={{
              fontFamily: "var(--app-font-sans), sans-serif",
              fontSize: "clamp(9px, 0.9vw, 11px)",
              color: "#FAEDCD",
              textTransform: "uppercase",
              marginTop: "1.4rem",
            }}
          >
            by Alfaruq
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
