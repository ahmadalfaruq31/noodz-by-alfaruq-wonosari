import Navbar from "@/components/Navbar";
import SequenceScroll from "@/components/SequenceScroll";
import AboutSection from "@/components/AboutSection";
import MenuGrid from "@/components/MenuGrid";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import MarqueeTicker from "@/components/MarqueeTicker";

export default function Home() {
  return (
    <main
      style={{
        width: "100%",
        margin: 0,
        padding: 0,
        background: "#000000",
        color: "hsl(var(--foreground))",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* Hero: 400vh scroll distance + fixed canvas overlay */}
      <SequenceScroll />

      {/* Content sections — z-index 10 sits above the fixed canvas layer (z-index 1) */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: "-100vh",
          padding: 0,
        }}
      >
        <AboutSection />
        <MarqueeTicker />
        <MenuGrid />
        <MarqueeTicker reverse />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
