"use client"

import Link from "next/link"
import axios from "axios"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { ChromeIcon, CodeXml, KeyRoundIcon, Mail, User } from 'lucide-react'
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function SignupComponent() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleUsername = (e: any) => {
    setUsername(e.target.value);
  }

  const handleEmail = (e: any) => {
    setEmail(e.target.value);
  }

  const handlePassword = (e: any) => {
    setPassword(e.target.value);
  }

  const handleSubmitButton = async () => {
    const data = { username, email, password };

    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/signup", data, {
        withCredentials : true,
      });

      if (response.data.status !== "signedup" && response.data.success !== true) {
        toast({
          title: "Error while signing up",
          description: "Something went wrong try again after sometime",
        })
      }

      toast({
        title: "Sign up successfull",
      })
      router.push('/signin');

      setEmail("");
      setUsername("");
      setPassword("");
    }
    catch (e) {
      console.error("Error during signup:", e);
      toast({
        title: "Error while signing up",
        description: "Something went wrong try again after sometime",
      })
    }
  }

  const handleGithubSignUp = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/github';
  };

  const handleGoogleSignUp = async () => {
    window.location.href = ("http://localhost:3000/api/v1/auth/google/dashboard")
  }

  return (
    <div className="w-full min-h-[calc(100vh-200px)] h-screen text-white/90 flex flex-row bg-[#111111] justify-center items-center">
      <div className="w-full lg:w-1/2 flex justify-center text-3xl sm:text-4xl font-semibold">
        <div className="w-full flex flex-col justify-center items-center gap-4 max-w-md">
          <div className="lg:hidden flex items-center text-3xl sm:text-4xl">
            <div className="flex items-center text-3xl sm:text-4xl">
              <span className="font-semibold flex items-center gap-3"><CodeXml className="h-8 w-8 md:h-10 md:w-10" /> Syntax Snipp.</span>
            </div>
          </div>
          <div className="text-xl md:text-2xl font-light flex flex-col">
            Welcome! 👋
          </div>
          <div className="w-full flex flex-col font-light px-6 gap-4">
            <div className="w-full flex flex-col gap-6">
              <div>
                <Label className="text-[16px] md:text-xl flex items-center gap-2"><User className="md:h-5 md:w-5 h-4 w-4" />Username</Label>
                <Input type="text" placeholder="Username" className="w-full max-w-lg border border-neutral-600" onChange={handleUsername} />
              </div>
              <div>
                <Label className="text-[16px] md:text-xl flex items-center gap-2"><Mail className="md:h-5 md:w-5 h-4 w-4" />Email</Label>
                <Input type="email" placeholder="name@example.com" className="w-full max-w-lg border border-neutral-600" onChange={handleEmail} />
              </div>
              <div>
                <Label className="text-[16px] md:text-xl flex items-center gap-2"><KeyRoundIcon className="md:h-5 md:w-5 h-4 w-4" />Password</Label>
                <Input type="password" placeholder="Enter your password" className="w-full max-w-lg border border-neutral-600" onChange={handlePassword} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-end text-sm underline">
                Reset password
              </div>
              <div className="w-full flex items-center justify-between">
                <Button className="px-4 py-2 w-full bg-white/90 text-black hover:bg-neutral-300" onClick={handleSubmitButton}>Sign Up</Button>
              </div>
              <div className="text-sm">
                Already have an account? <Link href={'/signin'} prefetch={false} className="underline">Sign In</Link>
              </div>
            </div>
            <div className="flex flex-col w-full gap-4 ">
              <div className="flex flex-col gap-4">
                <Separator orientation="horizontal" className="bg-neutral-700" />
                <Button className="w-full items-center gap-2 bg-white/90 text-black hover:bg-neutral-300" onClick={handleGoogleSignUp}><ChromeIcon className="md:w-5 md:h-5 h-4 w-4" />Sign in with Google</Button>
                <Button className="w-full items-center gap-2 bg-white/90 text-black hover:bg-neutral-300" onClick={handleGithubSignUp}><GitHubLogoIcon className="md:w-5 md:h-5 h-4 w-4" />Sign in with Github</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:w-1/2 lg:flex flex-col justify-center bg-neutral-900  min-h-screen">
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="flex items-center text-3xl sm:text-4xl">
            <span className="font-semibold flex items-center gap-3"><CodeXml className="h-4 w-4 md:h-10 md:w-10" /> Syntax Snipp.</span>
          </div>
          <div className="text-xl font-light max-w-2xl text-center">
            Dive into the Realm of Code Snippets<br /> Start Showcasing and Managing Your Code Masterpieces!
          </div>
        </div>
      </div>
    </div>
  )
}