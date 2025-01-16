"use client"

import React, { useState } from 'react';
import { Code, LayoutDashboard, MessageSquareDiff, SquareUser, Bookmark, Check, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faGithub, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Button } from '../ui/button';
import axios from 'axios';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { usePathname } from 'next/navigation';


const languages = [
  "JavaScript", "TypeScript", "Java", "Python", "C", "C++",
  "Rust", "Go", "SQL", "HTML", "Kotlin", "Flutter", "CSS", "ReactJs",
  "NextJs", "ExpressJs"
];

declare global {
  interface Window {
    Razorpay: any;
  }
}


export const Sidebar = () => {
  const pathname = usePathname();
  const { toast } = useToast()
  const [responseId, setResponseId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const router = useRouter()

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount: number) => {
    let data = JSON.stringify({
      amount: amount * 100,
      currency: "INR"
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payments/orders`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        handleRazorpayScreen(response.data.amount);
      })
      .catch((error) => {
        console.log("error at", error);
      });
  };

  const handleRazorpayScreen = async (amount: number) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Some error at razorpay screen loading");
      return;
    }

    const options = {
      key: 'rzp_test_fOkl8NGPmGodzi',
      amount: amount,
      currency: 'INR',
      name: "Syntax Snipp",
      description: "Upgrade to Pro",
      handler: async function (response: any) {
        setResponseId(response.razorpay_payment_id);
        const data = {
          paymentId: response.razorpay_payment_id,
          amount: amount,
        }
        try {
          const activateSubscription = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payments/activate-subscription`, data, {
            withCredentials: true,
          });
          if (!activateSubscription.data.success) {
            toast({
              title: "Payment Error",
              description: "Your payment was processed, but subscription activation failed. Please contact support.",
              variant: "destructive",
              duration: 3000
            });
          }
          else {
            toast({
              title: "Subscription Activated!",
              description: "Welcome to Syntax Snipp Pro! Enjoy Pro features.",
              variant: "default",
              duration: 3000
            });
          }
        } catch (error) {
          console.error("Subscription activation error:", error);
          toast({
            title: "Activation Error",
            description: "There was an issue activating your subscription. Please try again or contact support.",
            variant: "destructive",
            duration: 3000
          });
        }
      },
      theme: {
        color: "#272729"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleUpgradeClick = () => {
    setIsDialogOpen(true);
  };

  const handleAvailNowClick = () => {
    setIsDialogOpen(false);
    createRazorpayOrder(335);
  };

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutDialogOpen(false);
    toast({
      title: "Logged out!",
      duration: 3000
    })
    router.push('/logout');
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between text-white/90">
      <div className='flex flex-col'>
        <div className="flex flex-row gap-3 items-center justify-start py-4 px-6 cursor-pointer">
          <Code />
          <Link href={'/dashboard'} className="font-bold text-xl">Syntax Snipp</Link>
        </div>
        <Separator className="bg-slate-400/20" />
        <div className="flex my-4 flex-col gap-2 px-6">
          <Link
            href="/dashboard"
            className={`gap-3 flex flex-row justify-start items-center text-lg rounded-lg py-2 px-6 hover:bg-[#272729] transition ease-in duration-100 cursor-pointer ${pathname === "/dashboard" ? "bg-[#272729] text-white" : "text-white/90"
              }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <h1>Dashboard</h1>
          </Link>
          <Link
            href="/createsnippet"
            className={`gap-3 flex flex-row justify-start items-center text-lg rounded-lg py-2 px-6 hover:bg-[#272729] transition ease-in duration-100 cursor-pointer ${pathname === "/createsnippet" ? "bg-[#272729] text-white" : "text-white/90"
            }`}
          >
            <MessageSquareDiff className="h-5 w-5" />
            <h1>Create Snippet</h1>
          </Link>
          <Link
            href="/profile"
            className={`gap-3 flex flex-row justify-start items-center text-lg rounded-lg py-2 px-6 hover:bg-[#272729] transition ease-in duration-100 cursor-pointer ${pathname === "/profile" ? "bg-[#272729] text-white" : "text-white/90"
            }`}
          >
            <SquareUser className="h-5 w-5" />
            <h1>Profile</h1>
          </Link>
          <div
            onClick={handleLogoutClick}
            className="gap-3 flex flex-row justify-start items-center text-lg rounded-lg py-2 px-6 hover:bg-[#272729] transition ease-in duration-100 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <h1>Logout</h1>
          </div>
        </div>
        <Separator className="bg-slate-400/20" />
        <div className="my-8 flex flex-col gap-3">
          <h1 className="px-6 text-lg font-semibold flex flex-row items-center gap-2 "><Bookmark className='h-5 w-6' /> Popular Tags</h1>
          <div className="flex flex-wrap px-8 gap-3">
            {languages.map((language) => (
              <Badge
                key={language}
                variant="secondary"
                className="bg-[#272729] text-white/90 hover:text-black rounded-xl text-sm font-normal cursor-pointer"
              >
                {language}
              </Badge>
            ))}
          </div>
        </div>
        <Separator className="bg-slate-400/20" />
        <div className='my-6 flex flex-col px-4'>
          <div className='border border-slate-400/20 rounded-lg p-4'>
            <h1 className='text-xl font-bold'>Upgrade to Pro</h1>
            <h3 className='text-sm py-3'>Unlock unlimited snippets with advanced organization support!</h3>
            <Button className='bg-[#272729]' onClick={handleUpgradeClick}>Checkout features</Button>
          </div>
        </div>
      </div>
      <div className='mt-auto'>
        <Separator className="bg-slate-400/20" />
        <div className='flex flex-row justify-evenly px-16 gap-4 py-2'>
          <FontAwesomeIcon className='h-6 w-6 p-2 border border-slate-400/20 rounded-lg cursor-pointer hover:bg-[#272729] transition-colors' icon={faEnvelope} />
          <Link href={'https://www.linkedin.com/in/dishantmiyani/'} target='_blank' >
            <FontAwesomeIcon className='h-6 w-6 p-2 border border-slate-400/20 rounded-lg cursor-pointer hover:bg-[#272729] transition-colors' icon={faLinkedinIn} />
          </Link>
          <Link href={'https://github.com/dishant1804/'} target='_blank'>
            <FontAwesomeIcon className='h-6 w-6 p-2 border border-slate-400/20 rounded-lg cursor-pointer hover:bg-[#272729] transition-colors' icon={faGithub} />
          </Link>
          <Link href={'https://x.com/MiyaniDishant'} target='_blank' >
            <FontAwesomeIcon className='h-6 w-6 p-2 border border-slate-400/20 rounded-lg cursor-pointer hover:bg-[#272729] transition-colors' icon={faXTwitter} />
          </Link>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='bg-[#1a1a1a] border-none text-white/90 w-full max-w-xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Upgrade to Pro</DialogTitle>
            <DialogDescription>
              Unlock the full potential of Syntax Snipp with our Pro plan!
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-row items-center'>
            <h1 className='text-xl font-bold'>$3.99</h1>
            <h3 className='text-sm'>/month</h3>
          </div>
          <div className="py-4">
            <h3 className="font-semibold mb-2">Pro Features:</h3>
            <ul className="space-y-1">
              <li className='flex flex-row items-center gap-2'><Check className='h-4 w-4 text-green-400' />Unlimited code snippets</li>
              <li className='flex flex-row items-center gap-2'><Check className='h-4 w-4 text-green-400' />Advanced organization tools</li>
              <li className='flex flex-row items-center gap-2'><Check className='h-4 w-4 text-green-400' />Priority support</li>
              <li className='flex flex-row items-center gap-2'><Check className='h-4 w-4 text-green-400' />Private snippets</li>
              <li className='flex flex-row items-center gap-2'><Check className='h-4 w-4 text-green-400' />Collaboration features</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Button onClick={handleAvailNowClick} className='bg-neutral-700 hover:bg-neutral-800'>Avail Now</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className='bg-[#1a1a1a] border-none text-white/90 w-full max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-xl'>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setIsLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleLogoutConfirm}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};