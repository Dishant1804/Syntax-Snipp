import React from 'react';
import { RotateCcw, Search } from "lucide-react";
import Image from 'next/image';
import siteImage from '../../utils/screenshot.png'

const BrowserMockupComponent = () => {
  return (
    <div className="w-full flex justify-center px-6 py-4 md:px-12 min-h-auto ">
      <div className="w-full max-w-7xl bg-[#222222] rounded-xl overflow-hidden flex flex-col shadow-2xl shadow-black">
        <div className="flex flex-col sm:flex-row px-4 py-2 bg-[#333333] rounded-t-xl">
          <div className="md:flex flex-row gap-2 items-center mb-2 sm:mb-0 hidden ">
            <span className="bg-red-500 h-3 w-3 rounded-full"></span>
            <span className="bg-yellow-500 h-3 w-3 rounded-full"></span>
            <span className="bg-green-500 h-3 w-3 rounded-full"></span>
          </div>
          <div className="w-full sm:w-[90%] flex justify-center">
            <div className="bg-[#222222] w-full max-w-sm py-1 rounded-lg px-3 flex flex-row gap-2 items-center text-sm">
              <Search className="h-4 w-4 flex-shrink-0" />
              <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center">https://syntaxsnipp.com</span>
              <RotateCcw className="h-4 w-4 flex-shrink-0" />
            </div>
          </div>
        </div>
        <div className="relative w-full p-1">
          <Image
            src={siteImage}
            alt="Site preview"
            layout="cover"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  )
}

export default BrowserMockupComponent;