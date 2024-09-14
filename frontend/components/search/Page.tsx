import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"


export const SearchComponent = () => {
  return <>
    <div className="flex px-6 py-4 text-white/90">
      <h1 className="text-xl">Search Snippets</h1>
    </div>
    <Separator className="bg-slate-400/20"/>
    <div className="bg-[#111111] px-10 py-3 backdrop-blur supports-[backdrop-filter]:bg-[#111111]/60">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search" className="pl-8 text-white/90 border-slate-400/20 " />
      </div>
    </div>
  </>
} 