"use client"

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { SpinnerWithText } from "../ui/spinnerWithText"
import { useDebounce } from "@/hooks/useDebounce"
import { truncateTitle, truncateDescription } from "@/helpers/helper"

type Snippet = {
  id: string;
  title: string;
  description: string;
  user: {
    username: string;
  };
  tags: string[];
};

export const SearchComponent = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchItem, setSearchItem] = useState<string>("");
  
  const debouncedSearchTerm = useDebounce(searchItem, 300);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/v1/snippet/displayallsnippets');
        console.log(response.data);
        setSnippets(response.data.allSnippets);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch snippets");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) =>
      snippet.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
      snippet.user.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [snippets, debouncedSearchTerm]);

  return (
    <div className="flex flex-col h-full text-white/90">
      <div className="flex px-6 py-4 text-white/90">
        <h1 className="text-xl">Search Snippets</h1>
      </div>
      <Separator className="bg-slate-400/20" />
      <div className="px-8 py-3 supports-[backdrop-filter]:bg-[#111111]/60">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8 text-white/90 border-slate-400/20"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-grow px-8 overflow-y-auto" type="always" >
        <div className="flex flex-col pb-1">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <SpinnerWithText />
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            filteredSnippets.length > 0 ? (
              filteredSnippets.map((snippet) => (
                <div key={snippet.id} className="h-auto flex flex-col border border-slate-400/20 rounded-lg p-4 mb-4 hover:hover:bg-[#272729]/30 transition ease-in-out duration-100 ">
                  <div className="text-lg font-medium flex">{snippet.user.username}</div>
                  <div className="text-md font-medium">{truncateTitle(snippet.title)}</div>
                  <div className="text-sm font-mono mt-4 flex flex-wrap">
                    {truncateDescription(snippet.description)}
                  </div>
                  <div className="mt-2">
                    {snippet.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-[#272729] mr-1.5 my-1 text-white/90 hover:text-black rounded-xl text-sm font-normal cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div>No snippets found for "{debouncedSearchTerm}"</div>
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
};