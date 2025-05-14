import { Editor, Monaco } from '@monaco-editor/react';
import { customTheme } from '@/helpers/helper';
import { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '../ui/button';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LockKeyholeIcon } from 'lucide-react';
import { editor } from 'monaco-editor';
import { useToast } from "@/hooks/use-toast"

type SnippetContents = {
  title: string,
  description: string,
  tags: string[],
}

export const MonacoEditorCreateSnippetComponent = ({ title, description, tags }: SnippetContents) => {
  const monacoRef = useRef<Monaco | null>(null);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: '100%' });
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const router = useRouter();
  const { toast } = useToast();

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('customTheme', customTheme);
    monacoRef.current = monaco;
  }

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    monaco.editor.setTheme('customTheme');
    editorRef.current = editor;
  }

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: `${containerRef.current.clientWidth}px`
        });
      }
    };

    const fetchProfile = async () => {
      const profileResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/user/profile`, {
        withCredentials: true,
      });

      if (profileResponse.data.success) {
        setIsSubscribed(profileResponse.data.profile.isSubscribed);
      }
    }

    fetchProfile();

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const languages = [
    'javascript', 'python', 'java', 'c', 'c++', 'html', 'css', 'typescript', 'sql', 'php', 'ruby', 'go', 'swift', 'kotlin', 'flutter', 'xml', 'json', 'markdown', 'shell', 'r', 'vue', 'yaml', 'csharp'
  ];

  const handleSubmitSnippet = async () => {
    const content = editorRef.current?.getValue() || '';
    const data = {
      title,
      description,
      tags,
      content,
      language: selectedLanguage,
      isPrivate
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/snippet/createsnippet`, data, {
        withCredentials: true,
      });

      if (response.data.message === "Snippet created successfully") {
        router.push('/dashboard')
      }
    } catch (error) {
      if(process.env.NODE_ENV !== 'production'){
        console.error('Error creating snippet:', error);
      }
      toast({
        title: "Something went wrong",
        variant: "destructive",
        duration: 3000
      });
    }
  }

  return (
    <>
      <div className='px-4 mt-4 max-h-screen bg-[#1a1a1a] flex flex-col justify-center items-center rounded-xl'>
        <div className='flex flex-row w-full'>
          <div className='flex flex-row justify-start gap-2 items-center pt-4 pb-4 pl-3'>
            <div className='bg-red-500 h-3 w-3 rounded-full'></div>
            <div className='bg-yellow-500 h-3 w-3 rounded-full'></div>
            <div className='bg-green-500 h-3 w-3 rounded-full'></div>
          </div>
          <div className='flex items-center font-mono justify-center w-full text-white/90'>
            ~/Syntax-snipp/createSnippet
          </div>
        </div>
        <div className='flex flex-row w-full justify-between px-8 items-center mb-4'>
          <div className='flex flex-row items-center'>
            <h2>Select the language : &nbsp; </h2>
            <Select onValueChange={setSelectedLanguage} defaultValue={selectedLanguage}>
              <SelectTrigger className="w-[180px] border-white/20 outline-none">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent className='bg-[#272727] text-white/90 border-white/20 '>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='gap-4 flex flex-row items-center'>
            <div className="flex items-center space-x-2">
              <Switch
                className="data-[state=checked]:bg-neutral-500 data-[state=unchecked]:bg-neutral-700"
                id="private-mode"
                checked={isPrivate}
                onCheckedChange={() => setIsPrivate(!isPrivate)}
                disabled={!isSubscribed}
              />
              <Label htmlFor="private-mode" className="flex flex-row gap-2 items-center">
                <LockKeyholeIcon className="h-4 w-4" />
                <span>Private</span>
                {!isSubscribed && (
                  <span className="ml-2 text-sm text-neutral-400 tooltip" data-tip="Premium feature">
                    (Premium)
                  </span>
                )}
              </Label>
            </div>
            <Button onClick={handleSubmitSnippet} className="bg-neutral-700 hover:bg-neutral-800 font-bold">Create snippet</Button>
          </div>
        </div>
        <div ref={containerRef} className='flex-shrink overflow-hidden w-full'>
          <Editor
            height="45vh"
            width={dimensions.width}
            language={selectedLanguage}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              theme: 'customTheme',
              formatOnPaste: true,
              cursorBlinking: "smooth",
              fontSize: 16,
              tabSize: 4,
            }}
            className="flex"
          />
        </div>
      </div>
    </>
  );
}
