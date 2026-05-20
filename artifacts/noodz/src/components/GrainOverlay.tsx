import { useEffect, useRef } from "react";

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function paint() {
      if (!canvas || !ctx) return;
      frameRef.current++;
      // Only redraw every 2 frames to save perf
      if (frameRef.current % 2 !== 0) {
        rafRef.current = requestAnimationFrame(paint);
        return;
      }
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 18; // very faint — just a whisper of grain
      }
      ctx.putImageData(imageData, 0, 0);
      rafRef.current = requestAnimationFrame(paint);
    }
    rafRef.current = requestAnimationFrame(paint);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "overlay",
        opacity: 0.55,
      }}
      aria-hidden="true"
    />
  );
}
