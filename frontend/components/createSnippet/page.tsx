import { Separator } from '@/components/ui/separator'
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { MonacoEditorCreateSnippetComponent } from '../monacoEditorCreateSnippet/page';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

const CreateSnippetComponent = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [content, setContent] = useState<string>('');

  return <div className="flex flex-col h-screen text-white/90">
    <div className='px-12 py-4 text-xl flex flex-row  '>
      <h1 className='font-semibold'>Create Snippet</h1>
    </div>
    <Separator className='bg-slate-400/20' />
    <ScrollArea className='h-screen pb-2' type='always'>
      <div className='flex flex-col px-10 mt-2 '>
        <div className='flex flex-col justify-center w-full items-center'>
          <div className='w-[75%] flex flex-col'>
            <div className='gap-2 flex flex-col'>
              <Label className='text-xl flex items-start'>Title</Label>
              <Input placeholder="Title" className="pl-8 flex items-center text-white/90 border-slate-400/20 h-10 text-md" />
            </div>
            <div className='gap-2 flex flex-col mt-4'>
              <Label className='text-xl flex items-start'>Description</Label>
              <Input placeholder="Description" className="pl-8 flex items-center text-white/90 border-slate-400/20 h-10 text-md" />
            </div>
            <div className='gap-2 flex flex-col mt-4'>
              <Label className='text-xl flex items-start'>Tags</Label>
              <Input placeholder="Description" className="pl-8 flex items-center text-white/90 border-slate-400/20 h-10 text-md" />
            </div>
            <div className='flex flex-col mt-4'>
              <Label className='text-xl flex items-start'>Snippet</Label>
              <MonacoEditorCreateSnippetComponent />
            </div>
            <Button className='mt-4  bg-[#272727] text-white/90'>Submit</Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  </div>
}

export default CreateSnippetComponent;


