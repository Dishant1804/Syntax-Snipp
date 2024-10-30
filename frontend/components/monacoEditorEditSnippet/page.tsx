import { Editor, Monaco } from '@monaco-editor/react';
import { customTheme } from '@/helpers/helper';
import { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '../ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { LockKeyholeIcon } from 'lucide-react';

type SnippetContents = {
  title: string;
  description: string;
  tags: string[];
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  isPrivate: boolean;
  setIsPrivate: React.Dispatch<React.SetStateAction<boolean>>;
};

const MonacoEditorEditSnippetComponent = ({ id, title, description, tags, content, setContent, isPrivate, setIsPrivate }: SnippetContents) => {
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState({ width: '100%' });
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const router = useRouter();

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('customTheme', customTheme);
    monacoRef.current = monaco;
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monaco.editor.setTheme('customTheme');
    editorRef.current = editor;
    editor.setValue(content);
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: `${containerRef.current.clientWidth}px`
        });
      }
    };

    const fetchProfile = async() => {
      const profileResponse = await axios.get('http://localhost:3000/api/v1/auth/user/profile', {
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
    'javascript', 'python', 'java', 'c', 'c++', 'html', 'css', 'typescript', 'sql',
    'php', 'ruby', 'go', 'swift', 'kotlin', 'flutter', 'xml', 'json',
    'markdown', 'shell', 'r', 'vue', 'yaml', 'csharp'
  ];

  const handleSubmitSnippet = async () => {
    const updatedContent = editorRef.current?.getValue() || '';
    const data = {
      title,
      description,
      tags,
      content: updatedContent,
      language: selectedLanguage,
      isPrivate,
    };

    try {
      const response = await axios.patch(`http://localhost:3000/api/v1/snippet/updatesnippet/${id}`, data, {
        withCredentials: true
      });
      console.log('Snippet updated:', response.data);

      if (response.data.success) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error saving snippet:', error);
    }
  };

  return (
    <div className='px-4 mt-4 max-h-screen bg-[#1a1a1a] flex flex-col justify-center items-center rounded-xl'>
      <div className='flex flex-row w-full'>
        <div className='flex flex-row justify-start gap-2 items-center pt-4 pb-4 pl-3'>
          <div className='bg-red-500 h-3 w-3 rounded-full'></div>
          <div className='bg-yellow-500 h-3 w-3 rounded-full'></div>
          <div className='bg-green-500 h-3 w-3 rounded-full'></div>
        </div>
        <div className='flex items-center font-mono justify-center w-full text-white/90'>
          ~/Syntax-snippet/editSnippet
        </div>
      </div>
      <div className='flex flex-row w-full justify-between px-8 items-center mb-4'>
        <div className='flex flex-row'>
          <h2>Select the language: &nbsp; </h2>
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
          <Button onClick={handleSubmitSnippet} className="bg-neutral-700 hover:bg-neutral-800 font-bold">
            Update snippet
          </Button>
        </div>
      </div>
      <div ref={containerRef} className='flex-shrink overflow-hidden w-full'>
        <Editor
          height="45vh"
          width={dimensions.width}
          language={selectedLanguage}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          onChange={(value) => setContent(value || '')}
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
    </div >
  );
};

export default MonacoEditorEditSnippetComponent;
