import { Trash2, Star, Pencil } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { truncateDescription } from '@/helpers/helper'
import { MonacoEditorDisplaySnippetComponent } from '../monacoEditorDisplaySnippet/page'

type Snippet = {
  id: string;
  title: string;
  description: string;
  user: {
    username: string;
  };
  tags: string[];
};

export const MainSnippetComponent = () => {
  const [snippet, setSnippet] = useState<Snippet | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = '0513ee9d-ce55-40b1-8368-73635c17673d';
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/v1/snippet/displaysnippet/${id}`, {
          withCredentials: true,
        });
        console.log(response.data);
        setSnippet(response.data.snippet);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="text-white/90 flex flex-col">
      <div className='py-4 px-8 flex flex-row justify-between items-center'>
        <div className='flex flex-row gap-4'>
          <Star className='h-5 w-5 cursor-pointer' />
          <Pencil className='h-5 w-5 cursor-pointer' />
          <Trash2 className='h-5 w-5 cursor-pointer' />
        </div>
        <div className='pr-4'>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' />
          </Avatar>
        </div>
      </div>
      <Separator className='bg-slate-400/20' />
      <div className='mt-6 mb-6 px-6 flex flex-row gap-6 items-center'>
        <Avatar className='h-12 w-12 bg-slate-400/20'>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className='mt-2 font-semibold text-xl font-mono'>{snippet?.user.username}</h1>
          <p className='text-md mt-2'>{snippet?.title}</p>
          <p className='text-sm mt-1 font-mono'>{snippet?.description ? truncateDescription(snippet.description , 30) : ''}</p>
        </div>
      </div>
      <Separator className='bg-slate-400/20' />
      <div className='mt-4'>
        <MonacoEditorDisplaySnippetComponent />
      </div>
    </div>
  );
}