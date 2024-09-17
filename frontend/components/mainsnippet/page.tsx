import { Trash2, Star, Pencil } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export const MainSnippetComponent = () => {

  return <div className="text-white/90 flex flex-col" >
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
        <h1 className='mt-2 font-semibold text-xl font-mono'>Dishant Miyani</h1>
        <p className='text-md mt-2'>This is the snippet</p>
        <p className='text-sm mt-1'>This is the decription of the snippet created by Dishant Miyani</p>
      </div>
    </div>
    <Separator className='bg-slate-400/20' />
    <div>
      Display the snippet here
    </div>
  </div>
}

