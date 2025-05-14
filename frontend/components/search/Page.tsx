import { SetStateAction, useEffect, useMemo, useState } from "react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

type Snippet = {
  id: string;
  title: string;
  description: string;
  user: {
    username: string;
    profileImage: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
};

export const SearchComponent = ({ isSnippetDeleted, setActiveTab }: { isSnippetDeleted: boolean, setIsSnippetDeleted: React.Dispatch<SetStateAction<boolean>>, setActiveTab: React.Dispatch<SetStateAction<"allsnippets" | "mysnippets" | "favorites">>; }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchItem, setSearchItem] = useState<string>("");
  const [activeTabInternal, setActiveTabInternal] = useState<"allsnippets" | "mysnippets" | "favorites">("allsnippets");
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchItem, 300);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSnippets();
  }, [dispatch, activeTabInternal, isSnippetDeleted]);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      setError(null);
      let endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/snippet/displayallsnippets`

      if (activeTabInternal === "allsnippets") {
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/snippet/displayallsnippets`
      }
      if (activeTabInternal === "favorites") {
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/snippet/favoritesnippets`
      }
      if (activeTabInternal === "mysnippets") {
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/snippet/mysnippets`;
      }

      const response = await axios.get(endpoint, {
        withCredentials: true,
      });

      let fetchedSnippets = response.data.allSnippets || response.data.snippets || [];

      if (activeTabInternal === "allsnippets") {
        fetchedSnippets = fetchedSnippets.filter((snippet: Snippet) => !snippet.isPrivate);
      }

      setSnippets(fetchedSnippets);

      if (fetchedSnippets.length > 0) {
        dispatch(setSelectedSnippet(fetchedSnippets[0]));
        setSelectedSnippetId(fetchedSnippets[0].id);
      }
    } catch (e) {
      if(process.env.NODE_ENV !== 'production'){
        console.error(e);
      }
      setError("Failed to fetch snippets");
      setSnippets([]);
    }
    finally {
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
    setSelectedSnippetId(snippet.id);
  };
  const handleTabChange = (value: string) => {
    setActiveTabInternal(value as "allsnippets" | "mysnippets" | "favorites");
    setActiveTab(value as "allsnippets" | "mysnippets" | "favorites");
  };

  return (
    <div className="flex flex-col h-full text-white/90">
      <div className="flex flex-row items-center justify-center px-4 py-3 text-white/90">
        {/* <h1 className="xl:text-xl hidden xl:flex font-bold lg:pl-6">Search Snippets</h1> */}
        <Tabs value={activeTabInternal} onValueChange={handleTabChange} className="w-auto items-center justify-center flex">
          <TabsList className="flex flex-row gap-1 py-1.5 bg-[#272729]">
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
        <div className="flex flex-col pb-1 w-full h-full">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <SpinnerWithText />
            </div>
          ) : error ? (
            <div>{error}</div>
          ) : snippets.length === 0 ? (
            <div className="w-full h-[300px] flex justify-center items-center"><h1>No snippets found</h1></div>
          ) : (
            filteredSnippets.length > 0 ? (
              filteredSnippets.map((snippet: Snippet) => (
                <div
                  key={snippet.id}
                  className={`h-auto flex flex-col border border-slate-400/20 rounded-lg p-4 mb-4 transition ease-in-out duration-100 cursor-pointer ${selectedSnippetId === snippet.id
                    ? "bg-[#1a1a1a]/90 border-neutral-500/50"
                    : "hover:bg-[#272729]/30"
                    }`}
                  onClick={() => handleSnippetClick(snippet)}
                >
                  <div className="flex pb-2 flex-row items-center">
                    <Avatar className="w-8 h-8 mr-2 rounded-full">
                      <AvatarImage src={snippet.user.profileImage} alt="User" className="rounded-full" />
                      <AvatarFallback>{snippet.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-lg font-semibold">{snippet.user.username}</h2>
                  </div>
                  <h3 className="text-sm font-medium">{truncateTitle(snippet.title)}</h3>
                  <h4 className="text-xs font-mono mt-4 flex flex-wrap">
                    {truncateDescription(snippet.description, 18)}
                  </h4>
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
              <div className="w-full h-[300px] flex justify-center items-center">No snippets found for &quot;{debouncedSearchTerm}&quot;</div>
            )
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchComponent;
