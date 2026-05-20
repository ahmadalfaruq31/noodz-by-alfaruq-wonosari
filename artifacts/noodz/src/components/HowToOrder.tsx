import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Pilih Menu",
    desc: "Telusuri pilihan ramen kami di atas. Tentukan level pedasmu — dari mild hingga volcano.",
    icon: "🍜",
  },
  {
    number: "02",
    title: "Chat via WhatsApp",
    desc: "Klik tombol di bawah, langsung terhubung ke kami. Sebutkan menu pilihanmu dan alamat pengiriman.",
    icon: "💬",
  },
  {
    number: "03",
    title: "Pickup atau Delivery",
    desc: "Ambil sendiri di Wonosari, Jogja atau kami antar ke lokasimu. Makanan tiba panas siap slurp.",
    icon: "🛵",
  },
];

export default function HowToOrder() {
  return (
    <section className="relative bg-card py-28 px-6 md:px-16 overflow-hidden">
      {/* Subtle glow accent */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "hsl(var(--primary) / 0.08)",
          filter: "blur(100px)",
          bottom: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div className="mb-16 text-center">
          <motion.p
            className="font-sans text-xs tracking-[0.5em] text-primary mb-4 uppercase"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            CARA PESAN / 주문 방법
          </motion.p>
          <motion.h2
            className="font-display text-6xl md:text-8xl text-foreground leading-none"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            PESAN<br />
            <span className="text-primary">SEMUDAH INI</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-[52px] left-[16.67%] right-[16.67%] h-px"
            style={{
              background: "linear-gradient(90deg, hsl(var(--primary) / 0.5), hsl(var(--secondary) / 0.5), hsl(var(--primary) / 0.5))",
            }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative flex flex-col items-center text-center px-6 py-10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Icon circle */}
              <div
                className="relative z-10 w-[104px] h-[104px] rounded-full flex items-center justify-center mb-6 text-4xl"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--primary) / 0.4)",
                  boxShadow: "0 0 24px hsl(var(--primary) / 0.15)",
                }}
              >
                {step.icon}
              </div>

              {/* Step number */}
              <p
                className="font-display text-xs tracking-[0.4em] mb-3"
                style={{ color: "hsl(var(--primary))" }}
              >
                LANGKAH {step.number}
              </p>

              {/* Title */}
              <h3 className="font-display text-3xl md:text-4xl text-foreground leading-none mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          <motion.a
            href="https://wa.me/6281390348478"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-3 font-display text-xl md:text-2xl px-10 py-4 overflow-hidden group cursor-pointer"
            style={{
              background: "#25D366",
              color: "#fff",
              clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
              textDecoration: "none",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "#128C7E" }}
            />
            <span className="relative z-10">💬 Chat WhatsApp Sekarang</span>
          </motion.a>
        </motion.div>

        {/* Small note */}
        <motion.p
          className="font-sans text-xs text-muted-foreground text-center mt-5 tracking-wider"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          Respons cepat · Buka 11.00–02.00 WIB · Wonosari, Jogja
        </motion.p>
      </div>
    </section>
  );
}
