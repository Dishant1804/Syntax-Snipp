import NavbarComponent from "@/components/navbar/page";
import HeroSectionComponent from "../herosection/page";
import Particles from "../ui/particles";

export default function LandingPage() {
  return (
    <div className="bg-[#111111] relative h-[100vh] text-white/90">
      {/* <Particles
        className="absolute inset-0"
        quantity={200}
        ease={80}
        color={'#ffffff'}
        refresh
      /> */}
      <div className="flex flex-col">
        <NavbarComponent />
        <HeroSectionComponent />
      </div>
    </div>
  );
}
