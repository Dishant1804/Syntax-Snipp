import { Trash2, Star, Pencil } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MonacoEditorDisplaySnippetComponent } from '../monacoEditorDisplaySnippet/page';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store/store';
import { truncateDescription } from '@/helpers/helper';

export const MainSnippetComponent = () => {
  const snippet = useSelector((state: RootState) => state.snippet.selectedSnippet);

  if (!snippet) {
    return <div>No snippet selected</div>;
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
          <h1 className='mt-2 font-semibold text-xl font-mono'>{snippet.user.username}</h1>
          <p className='text-md mt-2'>{snippet.title}</p>
          <p className='text-sm mt-1 font-mono'>{snippet.description ? truncateDescription(snippet.description, 30) : ''}</p>
        </div>
      </div>
      <Separator className='bg-slate-400/20' />
      <div className='mt-4'>
        <MonacoEditorDisplaySnippetComponent content={snippet.content} language={snippet.language} />
      </div>
    </div>
  );
};