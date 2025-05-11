import NavbarComponent from "@/components/navbar/page";
import HeroSectionComponent from "../herosection/page";
import BrowserMockupComponent from "../browsermockup/page";
import Features from "../features/page";
import PricingComponent from "../pricing/page";
import FooterComponent from "../footer/page";
import PitchComponent from "../pitch/page";

export default function LandingPage() {
  return (
    <div className="bg-[#111111] relative h-full text-white/90 overflow-hidden">
      <div className="flex flex-col">
        <NavbarComponent isShareSnippet={false} />
        <HeroSectionComponent />
        <BrowserMockupComponent />
        <Features />
        <PitchComponent />
        <PricingComponent />
        <FooterComponent />
      </div>
    </div>
  );
}
