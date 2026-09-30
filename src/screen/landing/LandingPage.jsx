import "./landing.css";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Marquee from "./Marquee";
import PlanSection from "./PlanSection";
import BuildTeamSection from "./BuildTeamSection";
import PolicySection from "./PolicySection";
import GetStartedSection from "./GetStartedSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="landing-root grain min-h-screen overflow-x-hidden antialiased">
      <Navbar />
      <main>
        <HeroSection />
        <Marquee />
        <PlanSection />
        <BuildTeamSection />
        <PolicySection />
        <GetStartedSection />
      </main>
      <Footer />
    </div>
  );
}
