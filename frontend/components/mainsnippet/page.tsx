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

interface UserProfile {
  username: string;
  email: string;
}

export const MainSnippetComponent = ({ setIsSnippetDeleted, activeTab}: { setIsSnippetDeleted: React.Dispatch<SetStateAction<boolean>>, activeTab: "allsnippets" | "mysnippets" | "favorites"}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const snippet = useSelector((state: RootState) => state.snippet.selectedSnippet);
  const [isFavorite, setIsFavorite] = useState<boolean>(snippet?.favorite || false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const timeoutRef = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState<string>('');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/auth/user/profile", {
        withCredentials: true,
      });

      if (response.data.success && response.data.status === "retrieved") {
        setProfile(response.data.profile)
      }
    }
    catch (e) {
      console.log(e);
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
      const snippetUrl = `http://localhost:3001/sharesnippet/${snippet.id}`;
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
      console.error('Failed to copy text: ', err);
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
        `http://localhost:3000/api/v1/snippet/updatesnippet/${id}`,
        updateData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);

      if (response.data.message === "Snippet updated successfully") {
        setIsFavorite(!isFavorite);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteClick = async () => {
    const id = snippet.id;
    const response = await axios.delete(`http://localhost:3000/api/v1/snippet/deletesnippet/${id}`, {
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
              {activeTab === "mysnippets" && (
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
                        <AlertDialogAction onClick={handleDeleteClick}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
            <div className="pr-4">
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Avatar
                    className="cursor-pointer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <AvatarImage src='https://github.com/shadcn.png' alt="User avatar" />
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
            <Avatar className="h-12 w-12 bg-slate-400/20" onClick={() => router.push('')}>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='w-full'>
              <div className="flex flex-row w-full items-center justify-between">
                <div className='font-bold text-xl flex'>{snippet.user.username}</div>
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
                    <h1 className='flex text-neutral-400'>Updated at: {formatDate(snippet.updatedAt)}</h1>
                  ) : (
                    <h1 className='flex text-neutral-400'>Created at: {formatDate(snippet.createdAt)}</h1>
                  )}
                </div>
              </div>
              <p className="text-lg mt-1">{snippet.title}</p>
              <p className="text-sm mt-1">
                {snippet.description
                  ? truncateDescription(snippet.description, 30)
                  : ""}
              </p>
            </div>
          </div>
          <Separator className="bg-slate-400/20" />
          <div className='w-full flex flex-row justify-center px-4 py-3'>
            <div className='w-full flex flex-row bg-[#1a1a1a] items-center rounded-md overflow-hidden'>
              <div className='flex-grow flex items-center px-3 py-2'>
                <Link className='h-4 w-4 mr-2 text-white' />
                <h1 className='text-white truncate'>{url}</h1>
              </div>
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="icon"
                className='h-full aspect-square bg-neutral-700 hover:bg-neutral-700 rounded-none'
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
