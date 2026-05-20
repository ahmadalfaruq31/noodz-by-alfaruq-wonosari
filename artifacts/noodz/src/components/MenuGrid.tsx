import { motion } from "motion/react";

const menuItems = [
  {
    name: "Spicy Buldak Ramen",
    kor: "불닭 라멘",
    price: "45K",
    desc: "Kuah ayam bakar pedas, mie kenyal premium, daun bawang gosong, telur ramen. Level pedas bisa disesuaikan.",
    gradient: "radial-gradient(circle at 35% 40%, #FF6B35 0%, #E63946 45%, #8B0000 100%)",
  },
  {
    name: "Cheesy Kimchi Noodz",
    kor: "치즈 김치 면",
    price: "40K",
    desc: "Kimchi matang berpadu keju leleh, mie kenyal, taburan wijen renyah. Gurih pedas sempurna.",
    gradient: "radial-gradient(circle at 60% 30%, #F77F00 0%, #E63946 55%, #1A1A1A 100%)",
  },
  {
    name: "Garlic Bomb Broth",
    kor: "마늘 폭탄 브로스",
    price: "42K",
    desc: "Bawang putih hitam panggang, base tonkotsu kental, bawang goreng renyah, chashu tipis.",
    gradient: "radial-gradient(circle at 40% 50%, #3D1A00 0%, #C05C00 55%, #E63946 100%)",
  },
  {
    name: "Midnight Ramyun",
    kor: "미드나잇 라면",
    price: "38K",
    desc: "Gochujang pedas, tahu sutra lembut, wijen panggang, irisan nori. Favorit malam hari.",
    gradient: "radial-gradient(circle at 25% 60%, #D90429 0%, #6B21A8 55%, #0D0D0D 100%)",
  },
];

const toppings = [
  { name: "Hot Bar", price: "15K", desc: "Sosis hot bar ala Korea" },
  { name: "Sagak Eomuk", price: "15K", desc: "Fish cake kenyal gurih" },
  { name: "Telur Ramen", price: "8K", desc: "Setengah matang, kuah kecap" },
  { name: "Extra Chashu", price: "12K", desc: "Daging babi panggang tipis" },
];

interface MenuItem {
  name: string;
  kor: string;
  price: string;
  desc: string;
  gradient: string;
}

function ZigZagItem({ item, index }: { item: MenuItem; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className={`flex flex-col items-center ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-0`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
    >
      {/* ── Bowl circle ── */}
      <div className="relative z-10 flex-shrink-0 w-52 h-52 md:w-64 md:h-64">
        {/* Gradient bowl */}
        <div
          className="w-full h-full rounded-full shadow-2xl border-4 border-white/10"
          style={{ background: item.gradient }}
        />

        {/* Price badge */}
        <div
          className={`absolute top-3 ${isEven ? "right-0 md:-right-3" : "left-0 md:-left-3"} bg-red-700 text-white font-display text-sm leading-none px-3 py-2 rounded-full shadow-lg flex flex-col items-center`}
        >
          <span className="text-[9px] font-sans tracking-widest opacity-80">ONLY</span>
          <span className="text-base">{item.price}</span>
        </div>

        {/* Bowl shine */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.18) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ── Red text card ── overlaps circle via negative margin ── */}
      <div
        className={`
          relative bg-red-700 rounded-3xl text-white flex-1
          w-full
          px-8 py-8
          ${isEven
            ? "-mt-8 md:mt-0 md:-ml-10 md:pl-16"
            : "-mt-8 md:mt-0 md:-mr-10 md:pr-16"}
        `}
        style={{ minHeight: "180px" }}
      >
        {/* Korean label */}
        <p className="font-sans text-[10px] tracking-[0.4em] text-white/60 uppercase mb-1">
          {item.kor}
        </p>
        {/* Menu name */}
        <h3 className="font-display text-3xl md:text-4xl leading-none mb-3 text-white">
          {item.name}
        </h3>
        {/* Description */}
        <p className="font-sans text-sm text-white/80 leading-relaxed max-w-sm">
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function MenuGrid() {
  return (
    <section id="menu" className="bg-card py-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">

        {/* ── Section header (unchanged) ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <motion.p
              className="font-sans text-xs tracking-[0.4em] text-primary mb-3 uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              MENU KAMI / 메뉴
            </motion.p>
            <motion.h2
              className="font-display text-6xl md:text-8xl text-foreground"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              PILIH LEVEL<br />
              <span className="text-primary">PEDASMU</span>
            </motion.h2>
          </div>
          <motion.p
            className="font-sans text-sm text-muted-foreground max-w-xs leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Semua mangkuk dibuat ala Seoul. Tidak ada opsi biasa — kami tidak kenal setengah-setengah.
          </motion.p>
        </div>

        {/* ── Zig-zag menu items ── */}
        <div className="flex flex-col gap-8 md:gap-6">
          {menuItems.map((item, i) => (
            <ZigZagItem key={item.name} item={item} index={i} />
          ))}
        </div>

        {/* ── Topping Tambahan ── */}
        <motion.div
          className="relative mt-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Legend label — breaks the top border */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-red-700 text-white font-display text-sm tracking-[0.3em] px-5 py-2 rounded-full shadow-lg whitespace-nowrap">
              TOPPING TAMBAHAN
            </span>
          </div>

          <div className="border-2 border-red-700 rounded-2xl pt-10 pb-6 px-6">
            <div className="grid grid-cols-2 gap-4">
              {toppings.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col gap-0.5 px-4 py-3 rounded-xl bg-red-700/10 border border-red-700/25"
                >
                  <span className="font-display text-xl text-white leading-none">
                    {t.name.toUpperCase()}
                  </span>
                  <span className="font-sans text-xs text-muted-foreground">
                    {t.desc}
                  </span>
                  <span className="font-display text-primary text-lg mt-1">
                    +{t.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
