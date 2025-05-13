"use client"

import React, { useEffect, useState } from 'react';
import { Code, LayoutDashboard, MessageSquareDiff, SquareUser, Bookmark, Check, LogOut, Flame } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from '../ui/button';
import { buttonVariants } from "@/components/ui/button";
import axios from 'axios';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface SidebarProps {
  isCollapsed: boolean
}

interface UserProfile {
  name: string;
  email: string;
  profilePicture: string;
  isSubscribed: boolean;
}

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const { toast } = useToast()
  const [responseId, setResponseId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null);

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
    const data = JSON.stringify({
      amount: amount * 100,
      currency: "INR"
    });

    const config = {
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
        //console.log("error at", error);

        toast({
          title: "Something went wrong",
          variant: "destructive",
          duration: 3000
        });
      });
  };

  const handleRazorpayScreen = async (amount: number) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Some error at razorpay screen loading");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
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
          //console.error("Subscription activation error:", error);
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
    createRazorpayOrder(1);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/user/profile`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.status === "retrieved") {
        setProfile(response.data.profile)
      }
    }
    catch (e) {
      console.log(e);
      //
      toast({
        title: "Something went wrong",
        variant: "destructive",
        duration: 3000
      });
    }
  }

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
    <div
      data-collapsed={isCollapsed}
      className="w-full h-screen flex flex-col justify-between text-white/90 group border-r border-neutral-800"
    >
      <div className='flex flex-col'>
        <div className={cn(
          "flex items-center py-4 px-6 cursor-pointer",
          isCollapsed ? "justify-center" : "flex-row gap-3"
        )}>
          <Code className="h-5 w-5 my-1" />
          {!isCollapsed && (
            <Link href={'/dashboard'} className="font-bold text-xl">Syntax Snipp</Link>
          )}
        </div>
        <Separator className="bg-slate-400/20" />

        <nav className="grid px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 mt-4 gap-4">
          {isCollapsed ? (
            <>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-9",
                        pathname === "/dashboard" && "bg-[#272729] text-white"
                      )}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span className="sr-only">Dashboard</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Dashboard</TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href="/createsnippet"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-9",
                        pathname === "/createsnippet" && "bg-[#272729] text-white"
                      )}
                    >
                      <MessageSquareDiff className="h-5 w-5" />
                      <span className="sr-only">Create Snippet</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Create Snippet</TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href="/profile"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-9",
                        pathname === "/profile" && "bg-[#272729] text-white"
                      )}
                    >
                      <SquareUser className="h-5 w-5" />
                      <span className="sr-only">Profile</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Profile</TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleUpgradeClick}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-9"
                      )}
                    >
                      <Flame className="h-5 w-5" />
                      <span className="sr-only">Upgrade</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Upgrade to pro</TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleLogoutClick}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-9"
                      )}
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="sr-only">Logout</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                className={cn(
                  "gap-3 flex flex-row justify-start items-center text-md rounded-lg py-2 px-6 hover:bg-[#272729] transition ease-in duration-100 cursor-pointer",
                  pathname === "/dashboard" && "bg-[#272729] text-white"
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/createsnippet"
                className={cn(
                  "gap-3 flex flex-row justify-start items-center text-md rounded-lg py-2 px-6 hover:bg-[#272729] transition ease-in duration-100 cursor-pointer ",
                  pathname === "/createsnippet" && "bg-[#272729] text-white"
                )}
              >
                <MessageSquareDiff className="h-5 w-5" />
                <span>Create Snippet</span>
              </Link>

              <Link
                href="/profile"
                className={cn(
                  "gap-3 flex flex-row justify-start items-center text-md rounded-lg py-2 px-6 hover:bg-[#272729] transition ease-in duration-100 cursor-pointer ",
                  pathname === "/profile" && "bg-[#272729] text-white"
                )}
              >
                <SquareUser className="h-5 w-5" />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogoutClick}
                className="gap-3 flex flex-row justify-start items-center text-md rounded-lg py-2 px-6 hover:bg-[#272729] transition ease-in duration-100 cursor-pointer "
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </nav>

        {!isCollapsed && (
          <div className='flex flex-col w-full justify-center items-center'>
            <Separator className="bg-slate-400/20" />
            <div className="my-8 flex flex-col gap-3">
              <h1 className="px-6 text-lg font-semibold flex flex-row items-center gap-2">
                <Bookmark className='h-5 w-6' /> Popular Tags
              </h1>
              <div className="flex flex-wrap px-8 gap-3">
                {languages.map((language) => (
                  <Badge
                    key={language}
                    variant="secondary"
                    className="bg-[#272729] text-white/90 hover:text-black rounded-xl text-sm font-normal cursor-default"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator className="bg-slate-400/20" />
          </div>
        )}

        {!isCollapsed && (
          <div className='my-6 flex flex-col px-4 items-end'>
            <div className='border border-slate-400/20 rounded-lg p-4'>
              <h1 className='text-xl font-bold'>Upgrade to Pro</h1>
              <h3 className='text-sm py-3'>Unlock unlimited snippets with advanced organization support!</h3>
              <Button className='bg-[#272729]' onClick={handleUpgradeClick}>Checkout features</Button>
            </div>
          </div>
        )}
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
              <li className='flex flex-row items-center gap-2'><Check className='h-4 w-4 text-green-400' />150 code snippets</li>
              <li className='flex flex-row items-center gap-2'><Check className='h-4 w-4 text-green-400' />Priority support</li>
              <li className='flex flex-row items-center gap-2'><Check className='h-4 w-4 text-green-400' />Private snippets</li>
            </ul>
          </div>
          <div className="flex justify-center">
            {!profile?.isSubscribed ? (
              <Button onClick={handleAvailNowClick} className='bg-neutral-700 hover:bg-neutral-800'>Avail Now</Button>
            ) : <Button className='bg-neutral-800 hover:bg-neutral-800 cursor-default' >Already Subscribed!</Button>}
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
