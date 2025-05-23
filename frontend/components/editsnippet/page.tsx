"use client"

import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { X } from 'lucide-react';
import { SpinnerWithText } from '@/components/ui/spinnerWithText';
import axios from 'axios';
import MonacoEditorEditSnippetComponent from '../monacoEditorEditSnippet/page';
import { useToast } from "@/hooks/use-toast";

const EditSnippetComponent = () => {
  // const [snippet, setSnippet] = useState<{ title?: string; description?: string; tags?: string[]; content?: string; isPrivate?: boolean }>({});
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [id, setId] = useState<string>('');
  const { toast } = useToast();

  const addTag = () => {
    if (newTag.trim() !== '') {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const snippetId = urlParts[urlParts.length - 1];
    setId(snippetId);

    fetchSnippet(snippetId);
  }, []);

  const fetchSnippet = async (snippetId: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/snippet/displaysnippet/${snippetId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        // setSnippet(response.data.snippet);
        setTitle(response.data.snippet.title || '');
        setDescription(response.data.snippet.description || '');
        setTags(response.data.snippet.tags || []);
        setContent(response.data.snippet.content || '');
        setIsPrivate(response.data.snippet.isPrivate || false);
      }
    } catch (e) {
      if(process.env.NODE_ENV !== 'production'){
        console.log(e);
      }
      toast({
        title: "Something went wrong",
        variant: "destructive",
        duration: 3000
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen text-white/90">
      <div className='px-12 py-4 text-xl flex flex-row'>
        <h1 className='font-semibold'>Edit Snippet</h1>
      </div>
      <Separator className='bg-slate-400/20' />
      {loading ? (
        <SpinnerWithText />
      ) : (
        <ScrollArea className='h-screen pb-2' type='always'>
          <div className='flex flex-col px-10 mt-2'>
            <div className='flex flex-col justify-center w-full items-center'>
              <div className='w-[75%] flex flex-col'>
                <div className='gap-2 flex flex-col'>
                  <Label className='text-xl flex items-start'>Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="pl-8 flex items-center text-white/90 border-slate-400/20 h-10 text-md"
                  />
                </div>
                <div className='gap-2 flex flex-col mt-4'>
                  <Label className='text-xl flex items-start'>Description</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="pl-8 flex items-center text-white/90 border-slate-400/20 h-10 text-md"
                  />
                </div>
                <div className='flex flex-col mt-4'>
                  <Label className='text-xl flex items-start'>Tags</Label>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {tags.map((tag) => (
                      <div key={tag} className='flex items-center bg-[#272729] text-white p-4 py-1 rounded-full'>
                        {tag}
                        <button onClick={() => removeTag(tag)} className='ml-2'>
                          <X className='h-4 w-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className='flex mt-2'>
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      className="pl-8 flex items-center text-white/90 border-slate-400/20 h-10 text-md"
                    />
                    <Button onClick={addTag} className='ml-2 bg-[#272729] text-white/90'>
                      Add
                    </Button>
                  </div>
                </div>
                <div className='flex flex-col mt-4'>
                  <Label className='text-xl flex items-start'>Snippet</Label>
                  <MonacoEditorEditSnippetComponent
                    title={title}
                    description={description}
                    tags={tags}
                    content={content}
                    setContent={setContent}
                    id={id}
                    isPrivate={isPrivate}
                    setIsPrivate={setIsPrivate}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default EditSnippetComponent;
