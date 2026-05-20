import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide system cursor globally
    document.documentElement.style.cursor = "none";

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let hovering = false;
    let rafId: number;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function onEnter() { hovering = true; }
    function onLeave() { hovering = false; }

    // Mark interactive elements so ring can expand
    function addListeners() {
      document
        .querySelectorAll("a, button, [data-cursor-hover]")
        .forEach((el) => {
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
        });
    }
    addListeners();

    window.addEventListener("mousemove", onMove);

    function loop() {
      // Lag the ring behind the dot
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot) {
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
      if (ring) {
        const scale = hovering ? 2.2 : 1;
        ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px) scale(${scale})`;
        ring.style.opacity = hovering ? "0.5" : "1";
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#E63946",
          pointerEvents: "none",
          zIndex: 100000,
          boxShadow: "0 0 10px 3px rgba(230,57,70,0.7)",
          willChange: "transform",
          transition: "none",
        }}
        aria-hidden="true"
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(230,57,70,0.6)",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          transition: "transform 0.15s ease, opacity 0.25s ease",
          boxShadow: "0 0 16px 1px rgba(230,57,70,0.15)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
