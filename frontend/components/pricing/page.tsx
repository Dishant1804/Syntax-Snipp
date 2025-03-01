"use client"
import React from 'react';
import { motion } from "framer-motion";
import { Check, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
};

interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  isPro: boolean;
  onClick: () => void;
}

const PricingCard = ({ title, subtitle, price, features, isPro, onClick }: PricingCardProps) => (
  <motion.div 
    variants={cardVariants}
    className={`max-h-[60vh] w-full lg:w-1/3 bg-neutral-800 rounded-lg p-6 flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-lg hover:shadow-black ${isPro ? 'border-2 border-neutral-700 h-[60vh]' : 'h-[55vh]'}`}
    whileHover={{scale : 1.02}}
  >
    {isPro && (
      <motion.div 
        className="absolute -top-4 left-1/3 -translate-x-1/2 bg-neutral-700 text-white px-4 py-1 rounded-full text-sm font-medium"
        initial={{ scale: 1 }}
        animate={{ scale: 1.01 }}
        transition={{ delay: 1.5 }}
      >
        Most Popular
      </motion.div>
    )}
    <div>
      <h2 className="font-bold text-xl mb-2 md:text-2xl text-white">{title}</h2>
      {isPro && <Badge className="mb-2 bg-neutral-700">Most Popular</Badge>}
      <p className="text-sm text-neutral-300 mb-4">{subtitle}</p>
      <motion.div 
        className="font-bold text-2xl mb-4 md:text-3xl text-white"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {price}<span className="text-sm md:text-md text-neutral-300">/month</span>
      </motion.div>
      <Separator className="bg-slate-400/40 mb-6" />
      <ul className="mb-6 space-y-6">
        {features.map((feature, index) => (
          <motion.li 
            key={index} 
            className="flex items-center text-neutral-300 text-sm md:text-md md:font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 * index }}
          >
            <Check className="md:h-5 md:w-5 mr-2 text-green-400" />
            {feature}
          </motion.li>
        ))}
      </ul>
    </div>
    <motion.button
      className="w-full py-2 px-4 rounded-lg bg-neutral-900 text-white text-lg font-semibold shadow-md hover:bg-[#111111] shadow-black transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {title === "Enterprise" ? "Get In Touch" : "Get Started"}
    </motion.button>
  </motion.div>
);

const PricingComponent = () => {
  const router = useRouter();

  const handleFreeClick = () => {
    router.push('/signup');
  };

  const handleProClick = () => {
    console.log("Pro plan selected");
  };

  const handleEnterpriseClick = () => {
    console.log("Enterprise plan selected");
  };

  const plans = [
    {
      title: "Free",
      subtitle: "Best option for personal use",
      price: "$0",
      features: [
        "100 code snippets",
        "Basic organization",
        "Syntax highlighting",
        "Public snippets"
      ],
      isPro: false,
      onClick: handleFreeClick
    },
    {
      title: "Pro",
      subtitle: "Unlock the superpowers",
      price: "$3.99",
      features: [
        "Unlimited code snippets",
        "Advanced organization",
        "Priority support",
        "Private snippets",
        "Collaboration features"
      ],
      isPro: true,
      onClick: handleProClick
    },
    {
      title: "Enterprise",
      subtitle: "For teams & organizations",
      price: "Custom",
      features: [
        "Unlimited code snippets",
        "Advanced organization",
        "Dedicated support",
        "Custom features",
        "Advanced security",
        "Team analytics"
      ],
      isPro: false,
      onClick: handleEnterpriseClick
    }
  ];

  return (
    <div className="flex w-full h-full justify-center px-6 pb-12 md:px-12 my-20">
      <div className="flex flex-col w-full max-w-7xl gap-8">
        <motion.div 
          className="w-full flex justify-center text-center flex-col"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            Designed for Developers Like You
          </h1>
          <p className="text-sm md:text-lg py-4 text-center text-neutral-300">
            Unlock the power of coding snippets with Syntax Snipp
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col lg:flex-row w-full px-4 gap-10 lg:gap-8 items-center h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PricingComponent;