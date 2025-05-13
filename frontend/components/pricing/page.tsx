"use client"
import { Check } from "lucide-react";
import NavbarComponent from "../navbar/page"
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import FooterComponent from "../footer/page";


const PricingComponent = () => {
  const rouer = useRouter();

  const plans = [
    {
      title: "Free",
      price: 0,
      description: "For your basic needs",
      features: [
        "10 code snippets",
        "Basic support",
        "Public Snippets",
      ],
      buttonText: "Get Started",
    },
    {
      title: "Pro",
      price: 3.99,
      description: "Unlock super powers",
      features: [
        "150 code snippets",
        "Priority support",
        "Private Snippets",
      ],
      buttonText: "Get Pro",
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For teams & organizations",
      features: [
        "Unlimited code snippets",
        "Dedicated Support",
        "Custom features",
      ],
      buttonText: "Contact Us",
    }
  ];

  const handlePlanButton = () => {
    rouer.push('/signup');
  }

  return <>
    <NavbarComponent isShareSnippet={false} />
    <div className="w-full h-full pt-28 pb-20 flex justify-center items-center my-8 px-4">
      <div className="w-full h-full max-w-7xl flex flex-col justify-center items-center">
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <h1 className="text-neutral-300 font-semibold text-3xl md:text-4xl text-center">Pricing that makes sense!</h1>
          <h3 className="text-lg text-neutral-400 text-center">Choose the best plan for your needs</h3>
        </div>
        <div className="flex w-full max-w-6xl relative justify-between items-center flex-col md:flex-row gap-8 mt-16">
          {plans.map((plan, index) => (
            <div key={index} className={`flex flex-col justify-between items-stretch bg-[#111111] border ${plan.title === "Pro" ? "border-neutral-400/60 border-2 h-[450px]" : "h-[400px] border-slate-400/20"} rounded-xl p-6 w-full`} >
              <div className="flex flex-col">
                <div className="flex flex-col justify-center items-center">
                  {plan.title === "Pro" && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-neutral-100 text-black text-xs py-1 px-4 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h1 className="text-neutral-300 text-3xl font-semibold">{plan.title}</h1>
                  <h3 className="text-neutral-400 text-md">{plan.description}</h3>
                  <h1 className="text-neutral-300 text-4xl font-semibold py-6">{plan.title === "Enterprise" ? `${plan.price}` : `$${plan.price}/mo`}</h1>
                </div>
                <div className="flex flex-col gap-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Check className="text-white h-4 w-4" />
                      <span key={index} className="text-neutral-400 text-md font-normal">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handlePlanButton} className="mt-6 items-end">{plan.buttonText}</ Button>
            </div>
          ))}
        </div>
      </div>
    </div >
    <FooterComponent />
  </>
}

export default PricingComponent

