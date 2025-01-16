import React, { SetStateAction, useEffect, useMemo, useCallback, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SpinnerWithText } from "../ui/spinnerWithText";
import { useDebounce } from "@/hooks/useDebounce";
import { truncateTitle, truncateDescription } from "@/helpers/helper";
import { useDispatch } from "react-redux";
import { setSelectedSnippet } from "../../app/store/snippetSlice";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Snippet = {
  id: string;
  title: string;
  description: string;
  user: { username: string; email: string };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  content: string;
  language: string;
  favorite: boolean;
};

type TabType = "allsnippets" | "mysnippets" | "favorites";

interface SearchComponentProps {
  isSnippetDeleted: boolean;
  setIsSnippetDeleted: React.Dispatch<SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<SetStateAction<TabType>>;
}

const SnippetCard = React.memo(({ 
  snippet, 
  isSelected, 
  onClick 
}: { 
  snippet: Snippet; 
  isSelected: boolean; 
  onClick: () => void;
}) => (
  <div
    className={`h-auto flex flex-col border border-slate-400/20 rounded-lg p-4 mb-4 transition ease-in-out duration-100 cursor-pointer ${
      isSelected ? "bg-[#1a1a1a]/90 border-neutral-500/50" : "hover:bg-[#272729]/30"
    }`}
    onClick={onClick}
  >
    <div className="text-lg font-bold flex">{snippet.user.username}</div>
    <div className="text-md font-medium">{truncateTitle(snippet.title)}</div>
    <div className="text-sm font-mono mt-4 flex flex-wrap">
      {truncateDescription(snippet.description, 18)}
    </div>
    <div className="mt-2">
      {snippet.tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="bg-[#272729] mr-1.5 my-1 text-white/90 hover:text-black rounded-xl text-sm font-normal"
        >
          {tag}
        </Badge>
      ))}
    </div>
  </div>
));

export const SearchComponent: React.FC<SearchComponentProps> = ({ 
  isSnippetDeleted, 
  setIsSnippetDeleted,
  setActiveTab 
}) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchItem, setSearchItem] = useState("");
  const [activeTabInternal, setActiveTabInternal] = useState<TabType>("allsnippets");
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);

  const dispatch = useDispatch();
  const debouncedSearchTerm = useDebounce(searchItem, 300);

  const endpoints = {
    allsnippets: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/snippet/displayallsnippets`,
    mysnippets: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/snippet/mysnippets`,
    favorites: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/snippet/favoritesnippets`
  };

  const fetchSnippets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = endpoints[activeTabInternal];
      const response = await axios.get(endpoint, { withCredentials: true });
      
      let fetchedSnippets = response.data.allSnippets || response.data.snippets || [];
      
      if (activeTabInternal === "allsnippets") {
        fetchedSnippets = fetchedSnippets.filter((snippet: Snippet) => !snippet.isPrivate);
      }

      setSnippets(fetchedSnippets);

      if (fetchedSnippets.length > 0) {
        dispatch(setSelectedSnippet(fetchedSnippets[0]));
        setSelectedSnippetId(fetchedSnippets[0].id);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch snippets");
      setSnippets([]);
    } finally {
      setLoading(false);
    }
  }, [activeTabInternal, dispatch , endpoints]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets, isSnippetDeleted]);

  const filteredSnippets = useMemo(() => {
    const searchTerm = debouncedSearchTerm.toLowerCase();
    return snippets.filter((snippet) =>
      snippet.title.toLowerCase().includes(searchTerm) ||
      snippet.description.toLowerCase().includes(searchTerm) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      snippet.user.username.toLowerCase().includes(searchTerm)
    );
  }, [snippets, debouncedSearchTerm]);

  const handleSnippetClick = useCallback((snippet: Snippet) => {
    dispatch(setSelectedSnippet(snippet));
    setSelectedSnippetId(snippet.id);
  }, [dispatch]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTabInternal(value as TabType);
    setActiveTab(value as TabType);
  }, [setActiveTab]);

  return (
    <div className="flex flex-col h-full text-white/90">
      <div className="flex flex-row justify-between px-10 py-3">
        <h1 className="text-xl font-bold">Search Snippets</h1>
        <Tabs value={activeTabInternal} onValueChange={handleTabChange} className="w-auto items-center justify-center flex">
          <TabsList className="flex flex-row gap-2 bg-[#272729]">
            <TabsTrigger value="allsnippets" className="text-xs text-white/60 bg-[#1a1a1a]">All Snippets</TabsTrigger>
            <TabsTrigger value="mysnippets" className="text-xs text-white/60 bg-[#1a1a1a]">My Snippets</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs text-white/60 bg-[#1a1a1a]">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Separator className="bg-slate-400/20" />
      <div className="px-8 py-3 supports-[backdrop-filter]:bg-[#111111]/60">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8 text-white/90 border-slate-400/20 placeholder:text-neutral-400"
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
            filteredSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                isSelected={selectedSnippetId === snippet.id}
                onClick={() => handleSnippetClick(snippet)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchComponent;