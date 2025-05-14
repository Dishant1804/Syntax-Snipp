import { Trash2, Star, Pencil, Link, Check, Copy, LockKeyholeIcon, LockKeyholeOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MonacoEditorDisplaySnippetComponent } from '../monacoEditorDisplaySnippet/page';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store/store';
import { truncateDescription } from '@/helpers/helper';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { SpinnerWithText } from '@/components/ui/spinnerWithText';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from '../ui/button';
import { formatDate } from '@/helpers/helper'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  username: string;
  email: string;
  profileImage: string;
}

export const MainSnippetComponent = ({ setIsSnippetDeleted, activeTab }: { setIsSnippetDeleted: React.Dispatch<SetStateAction<boolean>>, activeTab: "allsnippets" | "mysnippets" | "favorites" }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const snippet = useSelector((state: RootState) => state.snippet.selectedSnippet);
  const [isFavorite, setIsFavorite] = useState<boolean>(snippet?.favorite || false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const timeoutRef = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState<string>('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/user/profile`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.status === "retrieved") {
        setProfile(response.data.profile)
      }
    }
    catch (e) {
      if(process.env.NODE_ENV !== 'production'){
        console.log(e);
      }
      toast({
        title: "Something went wrong",
        variant: "destructive",
        duration: 3000
      });

    }
  }

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsOpen(false);
  };


  useEffect(() => {
    if (snippet) {
      const snippetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/sharesnippet/${snippet.id}`;
      setUrl(snippetUrl);
      setLoading(true);
      setIsFavorite(snippet.favorite);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [snippet]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if(process.env.NODE_ENV !== 'production'){
        console.error('Failed to copy text: ', err);
      }
      toast({
        title: "Something went wrong",
        variant: "destructive",
        duration: 3000
      });

    }
  };

  if (!snippet) {
    return <div className="text-white/90 flex justify-center items-center h-screen">No snippet selected</div>;
  }

  const handleFavoriteClick = async () => {
    const id = snippet.id;

    const updateData = {
      favorite: !isFavorite,
    };

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/snippet/updatesnippet/${id}`,
        updateData,
        {
          withCredentials: true,
        }
      );

      if (response.data.message === "Snippet updated successfully") {
        setIsFavorite(!isFavorite);
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
    }
  };

  const handleDeleteClick = async () => {
    const id = snippet.id;
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/snippet/deletesnippet/${id}`, {
      withCredentials: true,
    })

    if (response.data.message === "Snippet deleted" || response.data.success === true) {
      setIsSnippetDeleted((prev) => !prev);
    }
  }

  const handleEditClick = () => {
    const id = snippet.id
    router.push(`/editsnippet/${id}`)
  }

  const handleMouseclickAvatar = () => {
    router.push('/profile')
  }

  return (
    <div className="text-white/90 flex flex-col">
      {loading ? (
        <SpinnerWithText />
      ) : (
        <>
          <div className="py-4 px-8 flex flex-row justify-between items-center">
            <div className="flex flex-row gap-4">
              {isFavorite ? (
                <FontAwesomeIcon
                  icon={faStar}
                  className="h-5 w-5 cursor-pointer"
                  onClick={handleFavoriteClick}
                />
              ) : (
                <Star
                  className="h-5 w-5 cursor-pointer"
                  onClick={handleFavoriteClick}
                />
              )}
              {(snippet.user.email === profile?.email) && (
                <>
                  <Pencil className="h-5 w-5 cursor-pointer" onClick={handleEditClick} />
                  <AlertDialog>
                    <AlertDialogTrigger><Trash2 className="h-5 w-5 cursor-pointer" /></AlertDialogTrigger>
                    <AlertDialogContent className='bg-[#18181a] border-0'>
                      <AlertDialogHeader>
                        <AlertDialogTitle className='text-white/90'>Are you sure you want to delete this snippet?</AlertDialogTitle>
                        <AlertDialogDescription className='text-neutral-300'>
                          Delete forever?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteClick} className='bg-neutral-700 hover:bg-neutral-800' >Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
            <div >
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Avatar
                    className="cursor-pointer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleMouseclickAvatar}
                  >
                    <AvatarImage src={profile?.profileImage} alt='' />
                    <AvatarFallback>
                      {snippet.user.username ? snippet.user.username.charAt(0).toUpperCase() : ''}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 bg-[#18181a] border-none"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      {profile && <>
                        <h1 className="font-bold leading-none text-white/90">{profile.username}</h1>
                        <p className="text-sm text-muted-foreground text-neutral-300">
                          {profile.email}
                        </p>
                      </>}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Separator className="bg-slate-400/20" />
          <div className="mt-4 mb-4 px-6 flex flex-row gap-6 items-center">
            <Avatar className="h-12 w-12 bg-slate-400/20">
              <AvatarImage src={snippet.user.profileImage} alt='' />
              <AvatarFallback>
                {snippet.user.username ? snippet.user.username.charAt(0).toUpperCase() : ''}
              </AvatarFallback>
            </Avatar>
            <div className='w-full'>
              <div className="flex flex-row w-full items-center justify-between">
                <div className='font-bold text-lg flex'>{snippet.user.username}</div>
                <div className='flex flex-row gap-3 items-center'>
                  {activeTab === 'mysnippets' && (
                    snippet.isPrivate ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger><LockKeyholeIcon className='h-4 w-4' /></TooltipTrigger>
                          <TooltipContent>
                            <p>Private Snippet</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger><LockKeyholeOpen className='h-4 w-4' /></TooltipTrigger>
                          <TooltipContent>
                            <p>Public Snippet</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  )}
                  {snippet.updatedAt && new Date(snippet.updatedAt) > new Date(snippet.createdAt) ? (
                    <h1 className='flex text-sm text-neutral-400'>Updated at: {formatDate(snippet.updatedAt)}</h1>
                  ) : (
                    <h1 className='flex text-sm text-neutral-400'>Created at: {formatDate(snippet.createdAt)}</h1>
                  )}
                </div>
              </div>
              <p className="text-sm mt-1">{snippet.title}</p>
              <p className="text-xs mt-1">
                {snippet.description
                  ? truncateDescription(snippet.description, 30)
                  : ""}
              </p>
            </div>
          </div>
          <Separator className="bg-slate-400/20" />
          <div className='w-full flex flex-row justify-center px-4 py-3'>
            <div className='w-full flex flex-row bg-[#1a1a1a] items-center rounded-md overflow-hidden relative'>
              <div className='w-full flex items-center px-3 py-2'>
                <Link className='h-4 w-4 mr-2 text-white' />
                <h1 className='text-white truncate text-sm pr-10'>{url}</h1>
              </div>
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="icon"
                className='absolute right-0 h-full aspect-square bg-neutral-700 hover:bg-neutral-700 rounded-none'
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-white" />}
              </Button>
            </div>
          </div>
          <Separator className="bg-slate-400/20" />
          <div className="mt-4">
            <MonacoEditorDisplaySnippetComponent
              content={snippet.content}
              language={snippet.language}
            />
          </div>
        </>
      )}
    </div>
  );
};
