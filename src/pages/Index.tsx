import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import TrustBar from "@/components/TrustBar";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div dir="rtl" className="min-h-screen grain-overlay">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorks />
      <TrustBar />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
