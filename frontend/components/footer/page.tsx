import { Code, Code2Icon } from "lucide-react";
import Link from "next/link";

const FooterComponent = () => {
  return (<div className="w-full flex justify-center items-center bottom-0 border-t border-slate-400/20 p-12">
    <div className="w-full h-80 flex flex-col justify-between items-center bg-[#111111] max-w-7xl">
      <div className="w-full flex justify-between items-start flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-2">
          <div className="w-full flex flex-row gap-3 items-center">
            <Code2Icon />
            <h1 className="text-2xl font-semibold">Syntax snipp</h1>
          </div>
          <div className="flex w-full">
            <h3>Code with superpowers Syntax Snipp</h3>
          </div>
        </div>
        <div className="flex flex-row gap-24 w-full items-start justify-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg pb-3 font-semibold">Pages</h1>
            <Link href='/' className="hover:underline">Home</Link>
            <Link href='/pricing' className="hover:underline">Pricing</Link>
            <Link href='/docs' className="hover:underline">Docs</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-lg pb-3 font-semibold">Socials</h1>
            <Link href='/' target="_blank" className="hover:underline">X</Link>
            <Link href='https://linkedin.com/in/dishantmiyani' target="_blank" className="hover:underline">LinkedIn</Link>
            <Link href='https://github.com/Dishant1804' target="_blank" className="hover:underline">GitHub</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-lg pb-3 font-semibold">Extensions</h1>
            <Link href='https://marketplace.visualstudio.com/items?itemName=DishantMiyani.syntax-snipp' target="_blank" className="hover:underline">Vs Code</Link>
            <Link href='/' className="hover:underline">NeoVim (soon)</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-lg pb-3 font-semibold">Legal</h1>
            <Link href='/' className="hover:underline">Terms of services</Link>
            <Link href='/' className="hover:underline">Privacy policy</Link>
          </div>
        </div>
      </div>
      <h1 className="text-9xl bg-clip-text text-transparent font-sans font-bold bg-gradient-to-b from-neutral-300/60 to-neutral-800/60">Syntax snipp</h1>
    </div>
  </div>
  )
}

export default FooterComponent;
