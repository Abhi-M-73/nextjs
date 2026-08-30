import BackgroundEffects from "../../components/ui/BackgroundEffects";
import Navbar from "../../components/common/Navbar";
import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import Footer from "../../components/common/Footer";
import AboutSection from "./AboutSection";
import HowItsWork from "./HowItsWork";
import EcosystemSection from "./EcosystemSection";
import TokenBridge from "./TokenBridge";
import LLDChart from "./LLDChart";

export default function LandingPage() {
<<<<<<< HEAD
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />
            <HeroSection />
            <TokenBridge />
            <EcosystemSection />
            <HowItsWork />
            <StatsSection />
            <Footer />
        </div>
    );
}
=======
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* <BackgroundEffects /> */}
      <Navbar />
      <HeroSection />
      <EcosystemSection />
      <HowItsWork />
      <StatsSection />
      {/* <LLDChart /> */}
      {/* <AboutSection /> */}
      <Footer />
    </div>
  );
}
>>>>>>> 656cdf7786a80072d334a9b766a9f44ddf07050c
