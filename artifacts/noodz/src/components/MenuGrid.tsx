import { motion } from "motion/react";

const menuItems = [
  {
    name: "Spicy Buldak Ramen",
    kor: "불닭 라멘",
    price: "$16",
    desc: "Fire chicken broth, chewy noodles, charred scallions",
    gradient: "radial-gradient(circle at 30% 40%, #E63946 0%, #D90429 50%, #1A1A1A 100%)",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    name: "Cheesy Kimchi Noodz",
    kor: "치즈 김치 면",
    price: "$14",
    desc: "Aged kimchi, melted gruyère, sesame crunch",
    gradient: "radial-gradient(circle at 60% 30%, #F77F00 0%, #E63946 60%, #1A1A1A 100%)",
    span: "",
  },
  {
    name: "Volcano Egg Top",
    kor: "화산 에그 탑",
    price: "$4",
    desc: "Add-on: runny ramen egg, chili oil drizzle",
    gradient: "radial-gradient(circle at 50% 70%, #FAEDCD 0%, #F77F00 50%, #D90429 100%)",
    span: "",
  },
  {
    name: "Garlic Bomb Broth",
    kor: "마늘 폭탄 브로스",
    price: "$15",
    desc: "Toasted black garlic, tonkotsu base, crispy shallots",
    gradient: "radial-gradient(circle at 40% 50%, #2D1B00 0%, #F77F00 60%, #1A1A1A 100%)",
    span: "",
  },
  {
    name: "K-BBQ Gyoza Side",
    kor: "케이비비큐 교자",
    price: "$9",
    desc: "Pan-fried pork & kimchi dumplings, ponzu dip",
    gradient: "radial-gradient(circle at 70% 30%, #D90429 0%, #8B0000 50%, #1A1A1A 100%)",
    span: "",
  },
  {
    name: "Midnight Ramyun",
    kor: "미드나잇 라면",
    price: "$13",
    desc: "Spicy gochujang, silken tofu, roasted sesame",
    gradient: "radial-gradient(circle at 20% 80%, #FF6B35 0%, #E63946 40%, #0D0D0D 100%)",
    span: "md:col-span-2",
  },
];

export default function MenuGrid() {
  return (
    <section className="bg-card py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <motion.p
              className="font-sans text-xs tracking-[0.4em] text-primary mb-3 uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              THE MENU / 메뉴
            </motion.p>
            <motion.h2
              className="font-display text-6xl md:text-8xl text-foreground"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              CHOOSE YOUR<br />
              <span className="text-primary">HEAT LEVEL</span>
            </motion.h2>
          </div>
          <motion.p
            className="font-sans text-sm text-muted-foreground max-w-xs leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            All bowls crafted in Seoul style. No mild options — we don't do lukewarm.
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
