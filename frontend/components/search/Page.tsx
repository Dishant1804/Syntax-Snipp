"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SpinnerWithText } from "../ui/spinnerWithText";
import { useDebounce } from "@/hooks/useDebounce";
import { truncateTitle, truncateDescription } from "@/helpers/helper";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSnippet } from "../../app/store/snippetSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState<"allsnippets" | "mysnippets">("allsnippets");

  const debouncedSearchTerm = useDebounce(searchItem, 300);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSnippets();
  }, [dispatch, activeTab]);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = activeTab === "allsnippets" 
        ? 'http://localhost:3000/api/v1/snippet/displayallsnippets'
        : 'http://localhost:3000/api/v1/snippet/mysnippets';
      const response = await axios.get(endpoint, {
        withCredentials: true,
      });
      const fetchedSnippets = response.data.allSnippets || response.data.snippets || [];
      setSnippets(fetchedSnippets);

      if (fetchedSnippets.length > 0) {
        dispatch(setSelectedSnippet(fetchedSnippets[0]));
      }
    } catch (e) {
      console.error(e);
      setError("Failed to fetch snippets");
      setSnippets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) =>
      snippet.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
      snippet.user.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [snippets, debouncedSearchTerm]);

  const handleSnippetClick = (snippet: Snippet) => {
    //@ts-ignore
    dispatch(setSelectedSnippet(snippet));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "allsnippets" | "mysnippets");
  };

  return (
    <div className="flex flex-col h-full text-white/90">
      <div className="flex flex-row justify-between px-10 py-3 text-white/90">
        <h1 className="text-xl font-medium">Search Snippets</h1>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto items-center justify-center flex">
          <TabsList className="grid w-auto h-auto grid-cols-2 bg-[#272729]">
            <TabsTrigger value="allsnippets" className="bg-black">All Snippets</TabsTrigger>
            <TabsTrigger value="mysnippets" className="bg-black">My Snippets</TabsTrigger>
          </TabsList>
        </Tabs>
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
      <ScrollArea className="flex-grow px-8 overflow-y-auto" type="always">
        <div className="flex flex-col pb-1">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <SpinnerWithText />
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : snippets.length === 0 ? (
            <div>No snippets found</div>
          ) : (
            filteredSnippets.length > 0 ? (
              filteredSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="h-auto flex flex-col border border-slate-400/20 rounded-lg p-4 mb-4 hover:bg-[#272729]/30 transition ease-in-out duration-100 cursor-pointer"
                  onClick={() => handleSnippetClick(snippet)}
                >
                  <div className="text-lg font-medium flex">{snippet.user.username}</div>
                  <div className="text-md font-medium">{truncateTitle(snippet.title)}</div>
                  <div className="text-sm font-mono mt-4 flex flex-wrap">
                    {truncateDescription(snippet.description, 18)}
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