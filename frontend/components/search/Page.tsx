import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Snippet {
  id: string;
  author: string;
  title: string;
  description: string;
  tags: string[];
}

// API response type
interface ApiResponse {
  data: Snippet[];
  // Add other fields if your API returns additional metadata
}

const SnippetCard: React.FC<Snippet> = React.memo(({ author, title, description, tags }) => (
  <div className="h-auto flex flex-col border border-slate-400/20 rounded-lg p-4 mb-4">
    <div className="text-lg font-medium flex">{author}</div>
    <div className="text-md font-medium">{title}</div>
    <div className="text-sm font-mono mt-4 flex flex-wrap">{description}</div>
    <div className="mt-2">
      {tags.map((tag) => (
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
));

export const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        // TODO: Replace 'YOUR_API_ENDPOINT_HERE' with your actual API endpoint
        const response = await axios.get('http://localhost:3000/api/v1/snippet/displayallsnippets');
        console.log(response.data)
        
        // Ensure that response.data.data is an array before setting it
        if (Array.isArray(response.data.data)) {
          setSnippets(response.data.data);
        } else {
          throw new Error('API response is not in the expected format');
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch snippets. Please try again later.');
        console.error('Error fetching snippets:', err);
        setSnippets([]); // Ensure snippets is an empty array in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  const filteredSnippets = useMemo(() => {
    if (!Array.isArray(snippets)) {
      console.error('snippets is not an array:', snippets);
      return [];
    }
    return snippets.filter(snippet => 
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [snippets, searchTerm]);

  return (
    <div className="flex flex-col h-screen bg-[#111111]">
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
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="text-white/90 px-8 flex-grow" type="always">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading snippets...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredSnippets.length > 0 ? (
          <div className="flex flex-col">
            {filteredSnippets.map((snippet) => (
              <SnippetCard key={snippet.id} {...snippet} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p>No snippets found.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};