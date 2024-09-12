"use client"

import axios from "axios"
import Link from "next/link"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { ChromeIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function SignupComponent() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState<string>("");
  const [email , setEmail] = useState<string>("");
  const [password , setPassword] = useState<string>("");

  const handleUsername = (e : any) => {
    setUsername(e.target.value);
  }

  const handleEmail = (e : any) => {
    setEmail(e.target.value);
  }

  const handlePassword = (e : any) => {
    setPassword(e.target.value);
  }

  const handleSubmitButton = async () =>{
    const data = { username, email, password };
    
    try{
      const response = await axios.post("http://localhost:3000/api/v1/auth/signup" , data);

      if(response.data.status !== "signedup" && response.data.success !== true){
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
    catch (e){
      console.error("Error during signup:", e);
      toast({
        title: "Error while signing up",
        description: "Something went wrong try again after sometime",
      })
    }
  }

  const handleGithubSignUp = async () => {
    window.location.href = ("http://localhost:3000/api/v1/auth/github")
  }

  const handleGoogleSignUp = async () =>{
    window.location.href = ("http://localhost:3000/api/v1/auth/google")
  }

  return (
    <div className="mx-10 sm:mx-auto max-w-[400px] space-y-6 flex flex-col justify-center items-center h-screen">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-muted-foreground">Create your account to get started.</p>
      </div>
      <div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter your username" required onChange={handleUsername} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" required onChange={handleEmail}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" required onChange={handlePassword} />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmitButton}>
            Sign Up
          </Button>
        </div>
        <Separator className="my-8" />
        <div className="space-y-4">
          <Button variant="outline" className="w-full" onClick={handleGithubSignUp} >
            <GitHubLogoIcon className="mr-2 h-4 w-4" />
            Sign up with GitHub
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
            <ChromeIcon className="mr-2 h-4 w-4" />
            Sign up with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline" prefetch={false}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}