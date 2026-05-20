import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const stats = [
  { value: 10000, suffix: "+", label: "Mangkuk Tersruput", kor: "슬러프된 그릇" },
  { value: 9, suffix: "", label: "Level Scoville", kor: "스코빌 레벨" },
  { value: 24, suffix: "J", label: "Jam Kuah Dimasak", kor: "브로스 시머" },
  { value: 1, suffix: "", label: "Lokasi di Jogja", kor: "족자 매장" },
];

function CountUp({
  target,
  suffix,
  active,
}: {
  target: number;
  suffix: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target]);

  return (
    <span>
      {count >= 1000 ? count.toLocaleString() : count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative bg-background py-28 px-6 md:px-16 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-full h-px top-0 opacity-20"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)" }}
        />
        <div
          className="absolute w-full h-px bottom-0 opacity-20"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.p
          className="font-sans text-xs tracking-[0.4em] text-primary mb-14 uppercase text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          DALAM ANGKA / 숫자로 보다
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              data-testid={`stat-${i}`}
              className="flex flex-col items-center justify-center py-8 md:py-0 px-4 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <p className="font-display text-6xl md:text-8xl text-primary leading-none mb-2">
                <CountUp target={stat.value} suffix={stat.suffix} active={isInView} />
              </p>
              <p className="font-display text-lg md:text-xl text-foreground mb-1">{stat.label}</p>
              <p className="font-sans text-xs tracking-widest text-muted-foreground">{stat.kor}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
