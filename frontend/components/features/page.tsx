import { Code, Database, Save, FolderOpen, RefreshCw, Tag, Code2, Link, Share2 } from "lucide-react";
import Image from "next/image";
import testimage from '@/utils/screenshot-files@2x.png'
import shareImage from '@/utils/shareImage.png'
import OrbitingCircles from "../ui/orbiting-circles";
import Icons from "@/helpers/icons";
import orbitImage from '@/utils/orbitImage.png'

const Features = () => {
  return <div className="flex w-full h-full justify-center px-6 py-12 md:px-12">
    <div className="flex flex-col w-full max-w-7xl gap-6">
      <div className="flex flex-col gap-4 lg:flex-row w-full justify-between items-center md:px-8 md:py-24">
        <div className="flex flex-col">
          <h1 className="text-md md:font-bold md:text-3xl pb-4 flex gap-2"><span className="bg-neutral-600 w-3"></span>Snippets : Pro's way to write code</h1>
          <p className="pb-4 w-full max-w-lg hidden md:flex">Code snippets help you avoid repeating the same code, streamlining your development process.</p>
          <ul className="flex gap-4 flex-col md:pl-8 text-white/90">
            <li className="gap-3 flex flex-row items-center">
              <Code className="h-5 w-5 text-blue-400" />
              <span className="text-sm md:text-lg">Craft Your Code Snippets</span>
            </li>
            <li className="gap-3 flex flex-row items-center">
              <Save className="h-5 w-5 text-green-400" />
              <span className="text-sm md:text-lg">Preserve Your Logic</span>
            </li>
            <li className="gap-3 flex flex-row items-center">
              <Database className="h-5 w-5 text-purple-400" />
              <span className="text-sm md:text-lg">Access Anytime, Anywhere</span>
            </li>
          </ul>
        </div>
        <Image src={testimage} height={500} width={500} alt="" objectFit="fill" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row w-full justify-between items-center md:px-8 mt-8">
        <div className="relative hidden md:flex h-[420px] w-[420px] flex-col items-center justify-center overflow-hidden bg-transparent">
          <OrbitingCircles
            className="size-[40px] border-none bg-transparent"
            duration={20}
            delay={20}
            radius={80}
          >
            <Icons.markdown />
          </OrbitingCircles>
          <OrbitingCircles
            className="size-[40px] border-none bg-transparent"
            duration={20}
            delay={10}
            radius={80}
          >
            <Icons.google />
          </OrbitingCircles>

          <OrbitingCircles
            className="size-[50px] border-none bg-transparent"
            radius={180}
            duration={20}
            reverse
          >
            <Icons.vsCode />
          </OrbitingCircles>
          <OrbitingCircles
            className="size-[50px] border-none bg-transparent"
            radius={180}
            duration={20}
            delay={20}
            reverse
          >
            <Icons.gitHub />
          </OrbitingCircles>
        </div>
        <div className="flex flex-col">
          <h1 className="text-md md:font-bold md:text-3xl pb-4 flex gap-2"><span className="bg-neutral-600 w-3"></span>Syntax Snipp Extension</h1>
          <p className="pb-4 w-full max-w-lg hidden md:flex text-white/80">Create, save, and manage your snippets directly from your VSCode editor</p>
          <ul className="flex gap-4 flex-col md:pl-8 text-white/90">
            <li className="gap-3 flex flex-row items-center">
              <Code2 className="h-5 w-5 text-blue-400" />
              <span className="text-sm md:text-lg">Create snippets from selected code with a single click</span>
            </li>
            <li className="gap-3 flex flex-row items-center">
              <FolderOpen className="h-5 w-5 text-green-400" />
              <span className="text-sm md:text-lg">Browse and insert snippets directly into your editor</span>
            </li>
            <li className="gap-3 flex flex-row items-center">
              <RefreshCw className="h-5 w-5 text-purple-400" />
              <span className="text-sm md:text-lg">Update existing snippets on the fly</span>
            </li>
            <li className="gap-3 flex flex-row items-center">
              <Tag className="h-5 w-5 text-yellow-400" />
              <span className="text-sm md:text-lg">Categorize snippets with custom tags for easy retrieval</span>
            </li>
          </ul>
        </div>
        <Image src={orbitImage} objectFit="fill" alt="" className="md:hidden"/>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row w-full justify-between items-center md:px-8 md:py-24">
        <div className="flex flex-col">
          <h1 className="text-md md:font-bold md:text-3xl pb-4 flex gap-2"><span className="bg-neutral-600 w-3"></span>Share your snippets</h1>
          <p className="pb-4 w-full max-w-lg hidden md:flex">
          With code snippets URL generation share the code snippets across various platforms
        </p>
        <ul className="flex gap-4 flex-col md:pl-8 text-white/90">
          <li className="gap-3 flex flex-row items-center">
            <Link className="h-5 w-5 text-green-400" />
            <span className="text-sm md:text-lg">Generate unique URLs for your code snippets instantly</span>
          </li>
          <li className="gap-3 flex flex-row items-center">
            <Share2 className="h-5 w-5 text-red-400" />
            <span className="text-sm md:text-lg">Share snippet URLs across various platforms easily</span>
          </li>
        </ul>
        </div>
        <Image src={shareImage} height={400} width={400} alt="" objectFit="fill" />
      </div>
    </div>
  </div>
}

export default Features;