import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PricingComponent = () => {
  return (
    <div className="flex w-full h-full justify-center px-6 py-12 md:px-12">
      <div className="flex flex-col w-full max-w-7xl gap-8">
        <div className="w-full flex justify-center text-center flex-col">
          <h1 className="text-2xl md:text-4xl font-bold">
            Designed for Developers Like You
          </h1>
          <p className="text-sm md:text-lg py-4 text-center text-neutral-300">
            Unlock the power of coding snippets with Syntax Snipp
          </p>
        </div>
        <div className="flex flex-col lg:flex-row w-full px-4 gap-6">
          {renderPricingCard("Free", "Best option for personal use", "$0", [
            "100 code snippets",
            "Basic organization",
            "Syntax highlighting",
            "Public snippets"
          ])}
          {renderPricingCard("Pro", "Unlock the superpowers", "$9.99", [
            "Unlimited code snippets",
            "Advanced organization",
            "Priority support",
            "Private snippets",
            "Collaboration features",
          ], true)}
          {renderPricingCard("Enterprise", "For large teams & organizations", "Custom", [
            "Unlimited code snippets",
            "Advanced organization",
            "Dedicated support",
            "Custom features",
            "Advanced security",
            "Team analytics"
          ])}
        </div>
      </div>
    </div>
  );
}

const renderPricingCard = (title: string , subtitle: string , price: string, features: string[], isPro = false) => (
  <div className={`h-auto w-full lg:w-1/3 bg-neutral-800 rounded-lg p-6 flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-black ${isPro ? 'border-2 border-neutral-600 scale-105' : ''}`}>
    <div>
      <h2 className="font-bold text-xl mb-2 md:text-2xl">{title}</h2>
      {isPro && <Badge className="mb-2 bg-neutral-700">Most Popular</Badge>}
      <p className="text-sm text-neutral-300 mb-4">{subtitle}</p>
      <div className="font-bold text-2xl mb-4 md:text-3xl">
        {price}<span className="text-sm md:text-lg text-neutral-300">/month</span>
      </div>
      <Separator className="bg-slate-400/40 mb-6"/>
      <ul className="mb-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-neutral-300 text-sm md:text-md">
            <Check className="md:h-5 md:w-5 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
    <Button className="w-full py-2 text-lg font-semibold hover:shadow-xl shadow-black">
      {title === "Enterprise" ? "Get In Touch" : "Get Started"}
    </Button>
  </div>
)

export default PricingComponent;