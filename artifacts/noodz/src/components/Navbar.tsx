import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const menuItems = [
  { eng: "MENU",   kor: "메뉴",  target: "menu"   },
  { eng: "STORY",  kor: "이야기", target: "story"  },
  { eng: "OUTLET", kor: "매장",  target: "outlet" },
  { eng: "ORDER",  kor: "주문",  target: "order"  },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function handleNav(target: string) {
    setIsOpen(false);
    // small delay so the overlay can start closing before scroll fires
    setTimeout(() => scrollToSection(target), 120);
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none mix-blend-difference text-foreground">
        <button
          className="font-display text-4xl tracking-wider text-primary font-bold pointer-events-auto cursor-pointer leading-none text-left bg-transparent border-none p-0"
          onClick={() => scrollToSection("story")}
          aria-label="Kembali ke atas"
        >
          NOODZ
          <span className="block font-sans text-[10px] tracking-[0.3em] text-foreground/50 font-normal uppercase mt-0.5">by Alfaruq</span>
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto p-2 bg-transparent text-foreground hover:text-primary transition-colors"
          aria-label="Buka menu"
        >
          <Menu size={36} />
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-background flex flex-col justify-center items-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 text-foreground hover:text-primary transition-colors"
              aria-label="Tutup menu"
            >
              <X size={48} />
            </button>

            <ul className="flex flex-col items-center gap-8">
              {menuItems.map((item, idx) => (
                <motion.li
                  key={item.eng}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                  className="group relative cursor-pointer overflow-hidden flex items-center justify-center text-6xl md:text-8xl font-display text-foreground hover:text-primary transition-colors"
                  onClick={() => handleNav(item.target)}
                >
                  <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-full group-hover:opacity-0">
                    {item.eng}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center text-primary translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.kor}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
