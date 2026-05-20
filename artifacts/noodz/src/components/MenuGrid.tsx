import { motion } from "motion/react";

const menuItems = [
  {
    name: "Spicy Buldak Ramen",
    kor: "불닭 라멘",
    price: "Rp 45.000",
    desc: "Kuah ayam bakar pedas, mie kenyal, daun bawang gosong",
    gradient: "radial-gradient(circle at 30% 40%, #E63946 0%, #D90429 50%, #1A1A1A 100%)",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    name: "Cheesy Kimchi Noodz",
    kor: "치즈 김치 면",
    price: "Rp 40.000",
    desc: "Kimchi matang, keju gruyère leleh, taburan wijen renyah",
    gradient: "radial-gradient(circle at 60% 30%, #F77F00 0%, #E63946 60%, #1A1A1A 100%)",
    span: "",
  },
  {
    name: "Volcano Egg Top",
    kor: "화산 에그 탑",
    price: "Rp 12.000",
    desc: "Tambahan: telur ramen setengah matang, siraman minyak cabai",
    gradient: "radial-gradient(circle at 50% 70%, #FAEDCD 0%, #F77F00 50%, #D90429 100%)",
    span: "",
  },
  {
    name: "Garlic Bomb Broth",
    kor: "마늘 폭탄 브로스",
    price: "Rp 42.000",
    desc: "Bawang putih hitam panggang, base tonkotsu, bawang goreng renyah",
    gradient: "radial-gradient(circle at 40% 50%, #2D1B00 0%, #F77F00 60%, #1A1A1A 100%)",
    span: "",
  },
  {
    name: "K-BBQ Gyoza Side",
    kor: "케이비비큐 교자",
    price: "Rp 28.000",
    desc: "Gyoza babi & kimchi goreng, celupan ponzu",
    gradient: "radial-gradient(circle at 70% 30%, #D90429 0%, #8B0000 50%, #1A1A1A 100%)",
    span: "",
  },
  {
    name: "Midnight Ramyun",
    kor: "미드나잇 라면",
    price: "Rp 38.000",
    desc: "Gochujang pedas, tahu sutra, wijen panggang",
    gradient: "radial-gradient(circle at 20% 80%, #FF6B35 0%, #E63946 40%, #0D0D0D 100%)",
    span: "md:col-span-2",
  },
];

export default function MenuGrid() {
  return (
    <section id="menu" className="bg-card py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.name}
              data-testid={`card-menu-${i}`}
              className={`relative group overflow-hidden rounded-sm cursor-pointer ${item.span}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{ background: item.gradient }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

              <div
                className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: "inset 0 0 0 1px hsl(var(--primary)), 0 0 30px hsl(var(--primary) / 0.4)",
                }}
              />

              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <p className="font-display text-2xl md:text-3xl text-white leading-none mb-0.5">{item.name}</p>
                <p className="font-sans text-xs tracking-widest text-white/60 mb-2">{item.kor}</p>
                <div className="flex items-center justify-between">
                  <p className="font-sans text-xs text-white/70 max-w-[70%] leading-snug">{item.desc}</p>
                  <span className="font-display text-xl text-primary">{item.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
