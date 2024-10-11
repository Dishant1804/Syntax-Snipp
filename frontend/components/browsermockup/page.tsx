import { RotateCcw, Search } from "lucide-react";
import Image from 'next/image';
import siteImage from '../../utils/image.png'


const BrowserMockupComponent = () => {
  return <div className="w-full flex justify-center h-[80vh] ">
    <div className="w-full max-w-7xl h-[70vh] bg-[#222222] rounded-xl">
      <div className="flex flex-row px-6 py-2 bg-[#333333] rounded-t-xl">
        <div className="flex flex-row gap-3 items-center">
          <span className="bg-red-500 h-4 w-4 rounded-full"></span>
          <span className="bg-yellow-500 h-4 w-4 rounded-full"></span>
          <span className="bg-green-500 h-4 w-4 rounded-full"></span>
        </div>
        <div className="w-[90%] flex justify-center">
          <div className="bg-[#222222] w-full max-w-sm py-2 rounded-lg px-3 flex flex-row gap-3 items-center">
            <Search className="h-5 w-5" />
            <span className="w-full flex justify-center">https://syntaxsnipp.com</span>
            <RotateCcw className="h-5 w-5" />
          </div>
        </div>
      </div>
      <Image src={siteImage} alt="not found" objectFit="fill" />
    </div>
  </div>
}

export default BrowserMockupComponent;