# Noodz — K-Ramen Scrolltelling Landing Page

A high-end, Awwwards-level scrolltelling landing page for "Noodz," a trendy Korean ramen brand. Features scroll-linked gradient animations, bold bilingual typography, and a cyberpunk-meets-Korean-street-food aesthetic.

## Run & Operate

- `pnpm --filter @workspace/noodz run dev` — run the frontend (port assigned via workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4
- Animation: Motion (motion/react) — scroll-linked gradients, word reveals, count-up
- Smooth Scroll: Lenis
- UI: shadcn/ui components

## Where things live

- `artifacts/noodz/` — the landing page frontend
- `artifacts/noodz/src/pages/Home.tsx` — main page assembly
- `artifacts/noodz/src/components/` — all section components
  - `Navbar.tsx` — fullscreen overlay menu with bilingual hover effects
  - `VideoScroll.tsx` — 400vh sticky scroll hero with animated gradients
  - `AboutSection.tsx` — word-by-word scroll reveal text
  - `MenuGrid.tsx` — bento grid with gradient cards and neon hover borders
  - `StatsSection.tsx` — count-up animated stats
  - `TestimonialsSection.tsx` — autoplay fullscreen testimonial slider
  - `CTASection.tsx` — pulsing neon CTA
  - `Footer.tsx` — social links and brand footer
- `artifacts/noodz/src/index.css` — brand palette (Gochujang Red, Spicy Orange, Sesame Cream, Charcoal Black), Bebas Neue + Space Grotesk fonts

## Architecture decisions

- Presentation-first app (no backend) — all data is static/hardcoded
- Lenis initialized in App.tsx via useEffect for smooth scroll integration with Motion
- VideoScroll uses h-[400vh] container with sticky inner div; subsequent sections use -mt-[100vh] z-10 to overlap the hero
- Gradient animation simulates steamy ramen video since no actual video file exists
- Motion's useScroll + useTransform used throughout for scroll-linked animations

## Product

A single-page scrolltelling experience for the Noodz K-Ramen brand. Sections: fullscreen animated hero, "Our Broth" word-reveal, bento menu grid, animated stats, testimonials slider, "Order Now" CTA, and footer.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
