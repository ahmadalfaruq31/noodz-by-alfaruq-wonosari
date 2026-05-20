import { motion } from "motion/react";

export default function CTASection() {
  return (
    <section className="relative py-40 px-6 md:px-16 flex flex-col items-center justify-center text-center overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "900px",
            height: "900px",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, hsl(var(--secondary) / 0.12) 50%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.p
          className="font-sans text-xs tracking-[0.4em] text-primary mb-6 uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          SIAP KEPEDASAN? / 준비됐어?
        </motion.p>

        <motion.h2
          className="font-display text-7xl md:text-9xl text-foreground leading-none mb-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          PESAN
        </motion.h2>

        <motion.h2
          className="font-display text-7xl md:text-9xl text-primary leading-none mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          SEKARANG
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.a
            href="https://wa.me/6281390348478"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="button-order-now"
            className="relative inline-flex items-center gap-3 font-display text-2xl md:text-3xl px-12 py-5 overflow-hidden group cursor-pointer"
            style={{
              background: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
              textDecoration: "none",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "hsl(var(--secondary))" }}
            />
            <span className="relative z-10">ORDER NOW</span>
            <span className="relative z-10 text-lg opacity-70">→</span>
          </motion.a>
        </motion.div>

        <motion.p
          className="font-sans text-xs text-muted-foreground mt-8 tracking-widest"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          PICKUP & DELIVERY — BUKA SETIAP HARI 11.00–02.00 WIB
        </motion.p>
      </div>
    </section>
  );
}
