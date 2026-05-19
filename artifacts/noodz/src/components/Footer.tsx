import { motion } from "motion/react";
import { SiInstagram, SiTiktok, SiX } from "react-icons/si";

export default function Footer() {
  const socials = [
    { icon: SiInstagram, label: "Instagram", href: "#" },
    { icon: SiTiktok, label: "TikTok", href: "#" },
    { icon: SiX, label: "X (Twitter)", href: "#" },
  ];

  return (
    <footer className="relative bg-card border-t border-border py-16 px-6 md:px-16 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), transparent)" }} />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <motion.p
              className="font-display text-6xl md:text-8xl text-foreground mb-2 leading-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              NOODZ
            </motion.p>
            <motion.p
              className="font-sans text-xs tracking-[0.3em] text-primary"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              BORN SPICY. SERVED HOT. — 서울에서 탄생
            </motion.p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-5">
              {socials.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  data-testid={`link-social-${s.label.toLowerCase()}`}
                  aria-label={s.label}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                >
                  <s.icon size={22} />
                </motion.a>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {["Myeongdong, Seoul", "Itaewon, Seoul"].map((loc) => (
                <p key={loc} className="font-sans text-xs text-muted-foreground tracking-widest uppercase">{loc}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between gap-4">
          <p className="font-sans text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Noodz. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-sans text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
