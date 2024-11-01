import React from 'react';
import { Spotlight } from '../ui/spotlight';
import BlurIn from '../ui/blur-in';
import Link from 'next/link';
import { RainbowButton } from '../ui/rainbow-button';

const HeroSectionComponent = () => {
  return (
    <>
      <Spotlight
        className="w-[80%] -top-12 left-16 md:-top-96 md:left-96 hidden lg:flex"
        fill="white"
      />
      <div className="flex flex-col w-full justify-center mt-16 md:mt-36">
        <div className="px-6 py-4 md:px-12 flex items-center justify-center text-center w-full md:h-full flex-col">
          <div className='flex flex-col sm:gap-4 items-center w-full'>
            <RainbowButton className='hidden sm:flex'>Try Beta Now! ✨</RainbowButton>
            <div className='py-2 text-sm md:text-lg text-center flex flex-wrap justify-center max-w-3xl md:max-w-6xl text-neutral-300 '>
              For&nbsp;<span className='underline'>Developers</span>&nbsp;by a Developer
            </div>
          </div>
          <div className="text-4xl font-bold md:text-7xl text-center md:font-bold md:text-start flex flex-wrap max-w-3xl md:max-w-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            <div className='flex flex-warp text-center flex-col'>
              <h1>Unleash your coding superpowers with</h1>
              <BlurIn word='Syntax Snipp' duration={2} className='text-4xl md:text-7xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 py-1 inline-block pointer-events-none ' />
            </div>
          </div>
          <div className='flex md:text-xl pt-4 md:pt-8 text-neutral-300 max-w-2xl md:max-w-4xl'>
            Syntax-snipp is your ultimate companion for creating, managing, and showcasing your code snippets. Say goodbye to repetitive coding, Access your snippets in IDEs, share them across your organizations.
          </div>
          <div className='flex md:flex-row pt-4 md:pt-8 gap-4'>
            <Link href={'/signup'} className='hidden md:flex px-4 items-center py-2 rounded-lg bg-neutral-300 text-[#111111] font-bold text-md font-mono hover:bg-neutral-200'>Get started for free</Link>
            <Link href={'/about'} className=' px-4 py-2 items-center rounded-lg bg-neutral-800 text-neutral-300 border border-slate-400/20 font-bold text-md font-mono hover:bg-neutral-900'>Explore Syntax Snipp</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroSectionComponent;