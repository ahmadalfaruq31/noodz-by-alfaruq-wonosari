import { useState, useEffect } from "react";
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
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const ids = menuItems.map((m) => m.target);
    const observers: IntersectionObserver[] = [];

    // Track which sections are currently intersecting
    const visible = new Map<string, number>();

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
          // Pick the section with the highest intersection ratio
          if (visible.size > 0) {
            const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0][0];
            setActiveSection(best);
          } else {
            setActiveSection("");
          }
        },
        { threshold: [0, 0.1, 0.3, 0.5], rootMargin: "-10% 0px -10% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function handleNav(target: string) {
    setIsOpen(false);
    setTimeout(() => scrollToSection(target), 120);
  }

  const activeItem = menuItems.find((m) => m.target === activeSection);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none mix-blend-difference text-foreground">
        <button
          className="font-display text-4xl tracking-wider text-primary font-bold pointer-events-auto cursor-pointer leading-none text-left bg-transparent border-none p-0"
          onClick={() => scrollToSection("story")}
          aria-label="Kembali ke atas"
        >
          NOODZ
          <span className="block font-sans text-[10px] tracking-[0.3em] text-foreground/50 font-normal uppercase mt-0.5">
            by Alfaruq
          </span>
        </button>

        <div className="flex items-center gap-5 pointer-events-auto">
          {/* Active section pill — visible when menu is closed */}
          <AnimatePresence mode="wait">
            {activeItem && !isOpen && (
              <motion.button
                key={activeItem.target}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3 }}
                onClick={() => scrollToSection(activeItem.target)}
                className="hidden md:flex items-center gap-2 bg-transparent border-none cursor-pointer"
              >
                <span
                  className="font-sans text-[10px] tracking-[0.4em] uppercase"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {activeItem.eng}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "hsl(var(--primary))", boxShadow: "0 0 6px 2px hsl(var(--primary) / 0.6)" }}
                />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsOpen(true)}
            className="p-2 bg-transparent text-foreground hover:text-primary transition-colors"
            aria-label="Buka menu"
          >
            <Menu size={36} />
          </button>
        </div>
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
              {menuItems.map((item, idx) => {
                const isActive = activeSection === item.target;
                return (
                  <motion.li
                    key={item.eng}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                    className="group relative cursor-pointer overflow-hidden flex items-center gap-4 text-6xl md:text-8xl font-display transition-colors"
                    style={{ color: isActive ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
                    onClick={() => handleNav(item.target)}
                  >
                    {/* Active dot */}
                    <motion.span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: "hsl(var(--primary))", boxShadow: "0 0 8px 3px hsl(var(--primary) / 0.5)" }}
                      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.3 }}
                      transition={{ duration: 0.3 }}
                    />

                    <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-full group-hover:opacity-0">
                      {item.eng}
                    </span>
                    <span className="absolute left-[calc(2.5rem+1rem)] inset-y-0 flex items-center justify-center text-primary translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {item.kor}
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            {/* Bottom hint */}
            {activeItem && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-10 font-sans text-xs tracking-[0.4em] text-muted-foreground uppercase"
              >
                Sekarang di: <span style={{ color: "hsl(var(--primary))" }}>{activeItem.eng}</span>
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
