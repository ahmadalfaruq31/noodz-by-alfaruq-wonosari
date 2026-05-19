import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const testimonials = [
  {
    quote:
      "I've eaten ramen in Tokyo, New York, and London. Noodz hit different. That broth is pure soul in a bowl.",
    name: "Minjun K.",
    location: "Seoul, South Korea",
  },
  {
    quote:
      "The Buldak hit me like a K-drama plot twist — totally unexpected, deeply emotional, and I need more.",
    name: "Sora L.",
    location: "Hong Kong",
  },
  {
    quote:
      "It's not just food. It's a whole experience. The atmosphere, the spice, the noodle pull — chef's kiss.",
    name: "Yuna P.",
    location: "Los Angeles, USA",
  },
  {
    quote:
      "Finally, ramen that doesn't apologize for being bold. Noodz is the future of Korean street food.",
    name: "Taeyang O.",
    location: "London, UK",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[current];

  return (
    <section className="relative bg-card py-0 overflow-hidden" style={{ minHeight: "70vh" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-5 blur-[200px]"
          style={{
            background: "hsl(var(--primary))",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center px-6 md:px-24 text-center" style={{ minHeight: "70vh" }}>
        <motion.p
          className="font-sans text-xs tracking-[0.4em] text-primary mb-12 uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          TESTIMONIALS / 후기
        </motion.p>

        <div className="relative w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-8"
            >
              <p className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight italic max-w-3xl">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-sans text-sm font-semibold text-foreground">{t.name}</p>
                <p className="font-sans text-xs tracking-widest text-muted-foreground mt-1">{t.location}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-2 mt-14">
          {testimonials.map((_, i) => (
            <button
              key={i}
              data-testid={`testimonial-dot-${i}`}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300"
            >
              <span
                className="block h-0.5 rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "32px" : "16px",
                  background: i === current ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
