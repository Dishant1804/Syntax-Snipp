import { Trash2, Star, Pencil } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MonacoEditorDisplaySnippetComponent } from '../monacoEditorDisplaySnippet/page';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store/store';
import { truncateDescription } from '@/helpers/helper';
import { useEffect, useState } from 'react';
import { SpinnerWithText } from '@/components/ui/spinnerWithText';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const MainSnippetComponent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const snippet = useSelector((state: RootState) => state.snippet.selectedSnippet);
  const [isFavorite, setIsFavorite] = useState<boolean>(snippet?.favorite || false);
  const router = useRouter();

  useEffect(() => {
    if (snippet) {
      setLoading(true);
      setIsFavorite(snippet.favorite);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [snippet]);

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
    const response = await axios.delete(`http://localhost:3000/api/v1/snippet/deletesnippet/${id}` , {
      withCredentials : true,
    })

    if(response.data.message === "Snippet deleted"){
      router.refresh();
    }
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
              <Pencil className="h-5 w-5 cursor-pointer" />
              <Trash2 className="h-5 w-5 cursor-pointer" onClick={handleDeleteClick} />
            </div>
            <div className="pr-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
            </div>
          </div>
          <Separator className="bg-slate-400/20" />
          <div className="mt-4 mb-4 px-6 flex flex-row gap-6 items-center">
            <Avatar className="h-12 w-12 bg-slate-400/20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-xl font-mono">
                {snippet.user.username}
              </h1>
              <p className="text-md mt-2">{snippet.title}</p>
              <p className="text-sm mt-1 font-mono">
                {snippet.description
                  ? truncateDescription(snippet.description, 30)
                  : ""}
              </p>
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
