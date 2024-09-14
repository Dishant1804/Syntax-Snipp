import React from 'react';
import { Code, LayoutDashboard, SquareDashedBottomCode, Star, MessageSquareDiff, SquareUser } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const languages = [
  "JavaScript", "TypeScript", "Java", "Python", "C", "C++",
  "Rust", "Go", "SQL", "HTML", "Kotlin", "Flutter" , "CSS", "ReactJs",
  "NextJs", "ExpressJs"
];

export const Sidebar = () => {
  const handleClick = (language: string) => {
    console.log(`Clicked: ${language}`);
    // Add the axios call to  backend to fetch the snippets based on languages
  };

  return (
    <div className="w-full h-auto flex flex-col text-white/90">
      <div className="flex flex-row gap-3 items-center justify-start py-4 px-6 cursor-pointer">
        <Code />
        <h1 className="font-medium text-xl">Syntax Snipp</h1>
      </div>
      <Separator className="bg-slate-400/20" />
      <div className="flex my-4 flex-col gap-2 px-6">
        {[
          { icon: LayoutDashboard, text: "Dashboard" },
          { icon: SquareDashedBottomCode, text: "My snippets" },
          { icon: Star, text: "Favorites" },
          { icon: MessageSquareDiff, text: "Create Snippet" },
          { icon: SquareUser, text: "Profile" }
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="gap-3 flex flex-row justify-start items-center text-lg rounded-lg py-2 px-6 hover:bg-[#272729] transition ease-in duration-100 cursor-pointer">
            <Icon className="h-5 w-5" />
            <h1>{text}</h1>
          </div>
        ))}
      </div>
      <Separator className="bg-slate-400/20" />
      <div className="my-8 flex flex-col gap-3">
        <h1 className="px-6 text-lg font-semibold">Popular Tags</h1>
        <div className="flex flex-wrap px-8 gap-4">
          {languages.map((language) => (
            <Badge
              key={language}
              variant="secondary"
              className="bg-[#272729] text-white/90 hover:text-black rounded-xl text-sm font-normal cursor-pointer"
              onClick={() => handleClick(language)}
            >
              {language}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};