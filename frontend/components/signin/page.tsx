"use client";

import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { ChromeIcon, CodeXml, KeyRoundIcon, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SpinnerWithText } from "../ui/spinnerWithText";

export default function SigninComponent() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmitButton = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please enter both email and password",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast({ title: "Signed in successfully", duration: 3000 });
        router.push("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: response.data.message || "Invalid credentials",
          duration: 5000,
        });
      }
    } catch (error) {
      if(process.env.NODE_ENV !== 'production'){
        console.error("Error during Signin:", error);
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/google/dashboard`;
  };

  const handleGithubSignIn = () => {
    setLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/github`;
  };

  return (
    <>
      {loading ? (
        <div className="w-full bg-[#111111] h-full flex justify-center items-center">
          <SpinnerWithText />
        </div>
      ) : (
        <div className="w-full min-h-[calc(100vh-200px)] h-screen text-white/90 flex flex-row bg-[#111111] justify-center items-center">
          <div className="hidden lg:w-1/2 lg:flex flex-col justify-center bg-neutral-900 min-h-screen">
            <div className="flex flex-col justify-center items-center gap-6">
              <div className="flex items-center text-3xl sm:text-4xl">
                <span className="font-semibold flex items-center gap-3">
                  <CodeXml className="h-4 w-4 md:h-10 md:w-10" /> Syntax Snipp.
                </span>
              </div>
              <div className="text-xl font-light max-w-2xl text-center">
                Welcome Back to the Realm of Code Snippets
                <br />
                Keep Showcasing and Managing Your Code Masterpieces!
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center text-3xl sm:text-4xl font-semibold">
            <form
              onSubmit={handleSubmitButton}
              className="w-full flex flex-col justify-center items-center gap-4 max-w-md"
            >
              <div className="lg:hidden flex items-center text-3xl sm:text-4xl">
                <div className="flex items-center text-3xl sm:text-4xl">
                  <span className="font-semibold flex items-center gap-3">
                    <CodeXml className="h-8 w-8 md:h-10 md:w-10" /> Syntax
                    Snipp.
                  </span>
                </div>
              </div>
              <div className="text-xl md:text-2xl font-light flex flex-col">
                Welcome back! 👋
              </div>
              <div className="w-full flex flex-col font-light px-6 gap-4">
                <div className="w-full flex flex-col gap-6">
                  <div>
                    <Label className="text-[16px] md:text-xl flex items-center gap-2">
                      <Mail className="md:h-5 md:w-5 h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full max-w-lg border border-neutral-600"
                      onChange={handleEmail}
                      value={email}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[16px] md:text-xl flex items-center gap-2">
                      <KeyRoundIcon className="md:h-5 md:w-5 h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full max-w-lg border border-neutral-600"
                      onChange={handlePassword}
                      value={password}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-end text-sm underline">
                    Reset password
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <Button
                      type="submit"
                      className="px-4 py-2 w-full bg-white/90 text-black hover:bg-neutral-300"
                    >
                      Sign In
                    </Button>
                  </div>
                  <div className="text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      href={"/signup"}
                      prefetch={false}
                      className="underline"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col w-full gap-4">
                  <div className="flex flex-col gap-4">
                    <Separator
                      orientation="horizontal"
                      className="bg-neutral-700"
                    />
                    <Button
                      type="button"
                      className="w-full items-center gap-2 bg-white/90 text-black hover:bg-neutral-300"
                      onClick={handleGoogleSignIn}
                    >
                      <ChromeIcon className="md:w-5 md:h-5 h-4 w-4" />
                      Sign in with Google
                    </Button>
                    {/* <Button
                      type="button"
                      className="w-full items-center gap-2 bg-white/90 text-black hover:bg-neutral-300"
                      onClick={handleGithubSignIn}
                    >
                      <GitHubLogoIcon className="md:w-5 md:h-5 h-4 w-4" />
                      Sign in with GitHub
                    </Button> */}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
