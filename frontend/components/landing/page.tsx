import NavbarComponent from "@/components/navbar/page";
import HeroSectionComponent from "../herosection/page";
import BrowserMockupComponent from "../browsermockup/page";
import Features from "../features/page";
import PricingComponent from "../pricing/page";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function LandingPage() {
  return (
    <div className="bg-[#111111] relative h-full text-white/90 overflow-hidden">
      <div className="flex flex-col">
        <NavbarComponent isShareSnippet={false} />
        <HeroSectionComponent />
        <BrowserMockupComponent />
        <Features />
        <PricingComponent />
      </div>
    </div>
  );
}
