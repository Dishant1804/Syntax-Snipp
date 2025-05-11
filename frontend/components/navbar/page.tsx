"use client"
import Link from "next/link";
import { Code2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { SpinnerWithText } from "../ui/spinnerWithText";


const NavbarComponent = ({ isShareSnippet }: { isShareSnippet: boolean }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSigninClick = () => {
    setLoading(true);
    router.push('/signin');
  }

  const handleSignupClick = () => {
    setLoading(true);
    router.push('/signup');
  }

  return (<>
    {loading ? (<div className="w-full bg-[#111111] h-full flex justify-center items-center">
      <SpinnerWithText />
    </div>) : (
      <nav className="w-full flex justify-center md:px-8 fixed z-10 ">
        <div className="w-full md:max-w-7xl flex flex-row md:justify-between items-center py-3 px-3 md:px-6 mx-3 my-2 rounded-xl gap-2 border border-slate-400/20 backdrop-blur-sm bg-[#111111]/20">
          <div className="font-semibold flex flex-row flex-nowrap gap-2 items-center">
            <Code2Icon className="flex h-5 w-5 md:h-6 md:w-6" />
            <Link href='/' className="text-xl text-neutral-300 md:text-2xl cursor-pointer">Syntax-snipp</Link>
          </div>
          <ul className="gap-4 lg:gap-6 hidden md:flex items-center font-semibold">
            {!isShareSnippet && <>
              {/* <Link href={''} className="hover:underline cursor-pointer">Features</Link > */}
              <Link href={'/pricing'} className="hidden lg:flex hover:underline cursor-pointer">Pricing</Link >
              {/* <Link href={'/docs'} className="hover:underline cursor-pointer">Docs</Link > */}
              <Link target="_blank" href={'https://marketplace.visualstudio.com/items?itemName=DishantMiyani.syntax-snipp'} className="hidden lg:flex hover:underline cursor-pointer">VsCode-Extension</Link >
            </>}
            <Button onClick={handleSigninClick} className="border hover:bg-[#111111] border-slate-400/50 px-4 py-2 rounded-xl">Log In</Button>
            <Button onClick={handleSignupClick} className="bg-white/90 hover:bg-white/80 text-[#111111] px-4 py-2 rounded-xl">Sign Up</Button>
          </ul>
        </div>
      </nav>)}
  </>);
}

export default NavbarComponent;
