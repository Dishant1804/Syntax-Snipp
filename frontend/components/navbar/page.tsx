import Link from "next/link";
import { Code2Icon } from "lucide-react";


const NavbarComponent = ({isShareSnippet} : {isShareSnippet :boolean}) => {
  return <nav className="w-full flex justify-center md:px-8 fixed z-10 ">
    <div className="w-full md:max-w-7xl flex flex-row md:justify-between items-center py-3 px-3 md:px-6 mx-3 my-2 rounded-xl gap-2 border border-slate-400/20 backdrop-blur-sm bg-[#111111]/20">
      <div className="font-semibold flex flex-row flex-nowrap gap-2 items-center">
        <Code2Icon className="flex h-5 w-5 md:h-6 md:w-6" />
        <Link href='/' className="text-xl md:text-2xl cursor-pointer">Syntax-snipp</Link>
      </div>
      <ul className="gap-4 lg:gap-6 hidden md:flex items-center font-semibold">
        {!isShareSnippet && <>
          <Link href={''} className="hover:underline cursor-pointer">Features</Link >
          <Link href={''} className="hidden lg:flex hover:underline cursor-pointer">Pricing</Link >
          <Link href={'/docs'} className="hover:underline cursor-pointer">Docs</Link >
        </>}
        <Link href='/signin' className="border border-slate-400/50 px-4 py-2 rounded-xl">Log In</Link>
        <Link href='/signup' className="bg-white/90 text-[#111111] px-4 py-2 rounded-xl">Sign Up</Link>
      </ul>
    </div>
  </nav>
};


export default NavbarComponent;