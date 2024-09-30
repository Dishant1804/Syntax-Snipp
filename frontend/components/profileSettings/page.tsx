import { Separator } from "@/components/ui/separator";
import { PaintbrushVertical, User } from "lucide-react";
import React from "react";

const ProfileSettingsSidebar = ({ setOption }: { setOption: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <div className="w-full h-screen flex flex-col justify-between text-white/90">
      <div className='flex flex-col'>
        <div className="flex flex-row gap-3 items-center justify-start py-4 px-6 cursor-pointer">
          <h1 className="font-medium text-xl">Options</h1>
        </div>
        <Separator className="bg-slate-400/20" />
        <div className="flex my-4 flex-col gap-2 px-6 w-full">
          <div className="gap-3 flex flex-row justify-start items-center text-lg rounded-lg py-2 px-6 hover:bg-[#272729] transition ease-in duration-100 cursor-pointer"
            onClick={() => setOption("account")}>
            <User className="h-5 w-5" />
            <h1>Account</h1>
          </div>
          <div className="gap-3 flex flex-row justify-start items-center text-lg rounded-lg py-2 px-6 hover:bg-[#272729] transition ease-in duration-100 cursor-pointer"
            onClick={() => setOption("theme")}>
            <PaintbrushVertical className="h-5 w-5" />
            <h1>Theme</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsSidebar;