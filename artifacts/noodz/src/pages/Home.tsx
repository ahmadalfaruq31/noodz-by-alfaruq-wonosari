import Navbar from "@/components/Navbar";
import VideoScroll from "@/components/VideoScroll";
import AboutSection from "@/components/AboutSection";
import MenuGrid from "@/components/MenuGrid";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full bg-background text-foreground overflow-hidden">
      <Navbar />
      <VideoScroll />
      <div className="-mt-[100vh] relative z-10">
        <AboutSection />
        <MenuGrid />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
