import NavbarComponent from "@/components/navbar/page";
import HeroSectionComponent from "../herosection/page";
import BrowserMockupComponent from "../browsermockup/page";
import Features from "../features/page";
import PricingComponent from "../pricing/page";

export default function LandingPage() {
  return (
    <div className="bg-[#111111] relative h-full text-white/90">
      <div className="flex flex-col">
        <NavbarComponent />
        <HeroSectionComponent />
        <BrowserMockupComponent />
        <Features />
        <PricingComponent />
      </div>
    </div>
  );
}
