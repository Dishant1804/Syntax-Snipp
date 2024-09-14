"use client"

import Link from "next/link"
import axios from "axios"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { GitHubLogoIcon } from "@radix-ui/react-icons" 
import { ChromeIcon } from "lucide-react"

export default function SigninComponent() {
  const [email , setEmail] = useState<string>("");
  const [password , setPassword] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const handleEmail = (e : any) => {
    setEmail(e.target.value);
  }

  const handlePassword = (e : any) => {
    setPassword(e.target.value);
  }


  const handleSubmitButton = async (e: any) => {
    e.preventDefault();
    
    const data = { email, password };
  
    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/signin", data);
  
      if(response.data.status !== "signedup" && response.data.success !== true){
        toast({
          title: "Error while signing up",
          description: "Something went wrong try again after sometime",
        })
      }

      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      router.push('/dashboard')

      setEmail("");
      setPassword("");
    } 
    catch (error) {
      console.error("Error during Signin:", error);
      toast({
        title: "Error while signing up",
        description: "Something went wrong try again after sometime",
      })
    }
  };

  const handleGoogleSignIn = async () =>{
    window.location.href = ("http://localhost:3000/api/v1/auth/google")
  }

  return (
    <div className="mx-10 sm:mx-auto max-w-[400px] space-y-6 flex flex-col justify-center items-center h-screen">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-muted-foreground">Welcome back, please sign in to your account.</p>
      </div>
      <div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" required onChange={handleEmail} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm text-muted-foreground hover:underline" prefetch={false}>
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" placeholder="Enter your password" required onChange={handlePassword} />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmitButton} >
            Sign In
          </Button>
        </div>
        <Separator className="my-8" />
        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            <GitHubLogoIcon className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}> 
            <ChromeIcon className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="underline" prefetch={false}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
