"use client"

import React, { useEffect, useState } from 'react';
import axios from "axios";
import NavbarComponent from "../navbar/page";
import { Badge } from "../ui/badge";
import MonacoEditorShareSnippetComponent from '../monacoEditorShareSnippet/page';
import { SpinnerWithText } from '../ui/spinnerWithText';

type Snippet = {
  id: string;
  title: string;
  description: string;
  content: string;
  language: string;
  user: {
    username: string;
  };
  tags: string[];
};


const ShareSnippetComponent: React.FC = () => {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSharedSnippet = async () => {
    try {
      setLoading(true);
      const currentUrl = window.location.href;
      const urlParts = currentUrl.split('/');
      const id = urlParts[urlParts.length - 1];

      if (id && id !== 'null') {
        try {
          const response = await axios.get(`http://localhost:3000/api/v1/snippet/sharesnippet/${id}`);
          setSnippet(response.data.snippet);
        } catch (error) {
          console.error('Error fetching snippet:', error);
        }
      } else {
        console.error('Invalid Url:', id);
      }
    }
    catch {

    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedSnippet();
  }, []);


  return (
    <div className="w-screen bg-[#111111] text-white/90 h-screen flex flex-col items-center">
      <NavbarComponent />
      {loading ? <>
        <div className="flex justify-center items-center h-screen">
          <SpinnerWithText />
        </div>
      </> :
        <>
          {snippet && <div className="flex flex-row px-8 w-full max-w-[80%] py-6 gap-8 items-center justify-center h-full">
            <div className="w-2/3 h-[calc(80vh-120px)]">
              <MonacoEditorShareSnippetComponent content={snippet.content} language={snippet.language} />
            </div>
            <div className="w-1/3 flex flex-col items-start">
              <h1 className="text-4xl font-bold mb-4">{snippet.title}</h1>
              <p className="text-xl mb-6">{snippet.description}</p>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {snippet.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[#272729] text-white/90 hover:bg-[#3a3a3c] rounded-xl text-md font-normal cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Author</h2>
                <p className="text-lg">{snippet.user.username}</p>
              </div>
            </div>
          </div>}
        </>}
    </div>
  );
}

export default ShareSnippetComponent;