"use client"

import Link from "next/link"
import SpinnerWithText from "@/components/ui/spinnerWithText"
import { ResizableHandle, ResizablePanel,ResizablePanelGroup} from "@/components/ui/resizable"
import { Sidebar } from '../sidebar/Page'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios';
import { SearchComponent } from "../search/Page"

interface Snippet {
  id : string;
  content : string;
  description : string;
  favorite? : boolean
}

export default function DashboardComponent() {
  const router = useRouter();
  const [ snippets , setSnippets ] = useState<Snippet[]>([]);
  const [isLoading , setIsLoading] = useState(true);
  const [ error , setError] = useState<String | null>(null); 

  // useEffect(() => {
  //   const fetchSnippets = async () => {
  //     setIsLoading(true);
  //     setError(null);
  //     const token = localStorage.getItem('token');

  //     try {
  //       const response = await axios.get<Snippet[]>(
  //         'http://localhost:3000/api/v1/snippet/displayallsnippets',
  //         {
  //           headers: {
  //             Authorization: token,
  //           },
  //         }
  //       );
  //       setSnippets(response.data);
  //     } catch (err) {
  //       if (axios.isAxiosError(err)) {
  //         setError(err.response?.data?.message || 'An error occurred while fetching snippets');
  //         if (err.response?.status === 401) {
  //           localStorage.removeItem('token');
  //           router.push('/signin');
  //         }
  //       } else {
  //         setError('An unexpected error occurred');
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchSnippets();
  // }, [router]);

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <SpinnerWithText/>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return <p className="text-red-500">Error: {error}</p>;
  // }



  return (
    <div className="min-h-screen w-screen bg-[#111111] flex flex-row justify-center">
      <ResizablePanelGroup direction="horizontal" className="">
      <ResizablePanel minSize={18} defaultSize={18} maxSize={24} >
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle className="h-screen bg-slate-400/20 " />
      <ResizablePanel minSize={28} defaultSize={32}>
        <SearchComponent />
      </ResizablePanel>
      <ResizableHandle withHandle className="h-screen bg-slate-400/20 " />
      <ResizablePanel minSize={44}>
        Main component
      </ResizablePanel>
    </ResizablePanelGroup>
    </div>
  )
}



