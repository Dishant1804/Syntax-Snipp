import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { MonacoEditorCreateSnippetComponent } from '../monacoEditorCreateSnippet/page';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { X } from 'lucide-react';
import { SpinnerWithText } from '@/components/ui/spinnerWithText';

const CreateSnippetComponent = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [loading , setLoading] = useState<boolean>(true);

  const addTag = () => {
    if (newTag.trim() !== '') {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    setTimeout(()=>{
      setLoading(false);
    } , 1000)
  },[])

  return (<div className="flex flex-col h-screen text-white/90">
      <div className='px-12 py-4 text-xl flex flex-row'>
        <h1 className='font-semibold'>Create Snippet</h1>
      </div>
      <Separator className='bg-slate-400/20' />
      {loading ? <SpinnerWithText /> : <ScrollArea className='h-screen pb-2' type='always'>
        <div className='flex flex-col px-10 mt-2'>
          <div className='flex flex-col justify-center w-full items-center'>
            <div className='w-[75%] flex flex-col'>
              <div className='gap-2 flex flex-col'>
                <Label className='text-lg flex items-start'>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="pl-8 flex items-center text-white/90 border-slate-400/20 h-10 text-md"
                />
              </div>
              <div className='gap-2 flex flex-col mt-4'>
                <Label className='text-lg flex items-start'>Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="pl-8 flex items-center text-white/90 border-slate-400/20 h-10 text-md"
                />
              </div>
              <div className='flex flex-col mt-4'>
                <Label className='text-lg flex items-start'>Tags</Label>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {tags.map((tag) => (
                    <div key={tag} className='flex items-center bg-[#272729] text-white p-4 py-1 rounded-full'>
                      {tag}
                      <button onClick={() => removeTag(tag)} className='ml-2'>
                        <X className='h-4 w-4'/>
                      </button>
                    </div>
                  ))}
                </div>
                <div className='flex mt-2'>
                  <Input 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Add tag"
                    className="pl-8 flex items-center text-white/90 border-slate-400/20 h-10 text-md"
                  />
                  <Button onClick={addTag} className='ml-2 bg-neutral-700 hover:bg-neutral-800 text-white/90'>
                    Add
                  </Button>
                </div>
              </div>
              <div className='flex flex-col mt-4'>
                <Label className='text-lg flex items-start'>Snippet</Label>
                <MonacoEditorCreateSnippetComponent title={title} description={description} tags={tags}/>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>}
    </div>
  );
};

export default CreateSnippetComponent;