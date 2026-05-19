import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const BROTH_TEXT =
  "Every bowl of Noodz starts with a 24-hour broth — slow-simmered bones, gochujang fire, and enough soul to make Seoul jealous.";

const words = BROTH_TEXT.split(" ");

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-background py-32 px-6 md:px-16 min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
          style={{
            background: "hsl(var(--primary))",
            top: "20%",
            right: "-10%",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.p
          className="font-sans text-xs tracking-[0.4em] text-primary mb-6 uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          OUR BROTH / 우리의 국물
        </motion.p>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = (i + 1) / words.length;
            return (
              <WordReveal
                key={i}
                word={word}
                progress={scrollYProgress}
                start={start * 0.6}
                end={Math.min(end * 0.6 + 0.1, 1)}
              />
            );
          })}
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "HAND-PULLED NOODLES", sub: "손으로 뽑은 면", desc: "Made fresh every morning from our proprietary wheat blend." },
            { label: "24H SLOW BROTH", sub: "24시간 브로스", desc: "Pork & chicken bones, gochugaru, doenjang. No shortcuts." },
            { label: "FIERY SOUL", sub: "매운 영혼", desc: "Every bowl is a love letter to the streets of Seoul." },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="border-t border-border pt-6"
            >
              <p className="font-display text-2xl text-foreground mb-1">{item.label}</p>
              <p className="font-sans text-xs text-primary tracking-widest mb-3">{item.sub}</p>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WordReveal({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const y = useTransform(progress, [start, end], [12, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight"
    >
      {word}&nbsp;
    </motion.span>
  );
}
