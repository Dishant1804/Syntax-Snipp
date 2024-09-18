import { Editor, Monaco } from '@monaco-editor/react';
import { customTheme } from '@/helpers/helper';
import { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const MonacoEditorCreateSnippetComponent = () => {
  const monacoRef = useRef<Monaco | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: '100%' });
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('customTheme', customTheme);
    monacoRef.current = monaco;
  }

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monaco.editor.setTheme('customTheme');
  }

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: `${containerRef.current.clientWidth}px`
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const languages = [
    'javascript', 'python', 'java', 'c' , 'c++' , 'html', 'css', 'typescript', 'sql', 'php', 'ruby', 'go', 'swift', 'kotlin', 'flutter', 'xml', 'json', 'markdown', 'shell', 'r', 'vue', 'yaml', 'csharp'
  ];

  return (
    <div className='px-4 mt-4 max-h-screen bg-[#1a1a1a] flex flex-col justify-center items-center rounded-xl'>
      <div className='flex flex-row w-full'>
        <div className='flex flex-row justify-start gap-3 items-center pt-4 pb-4 pl-3'>
          <div className='bg-red-500 h-3 w-3 rounded-full'></div>
          <div className='bg-yellow-500 h-3 w-3 rounded-full'></div>
          <div className='bg-green-500 h-3 w-3 rounded-full'></div>
        </div>
        <div className='flex items-center font-mono justify-center w-full text-white/90'>
          ~/Syntax-snipp/createSnippet
        </div>
      </div>
      <div className='flex flex-row w-full justify-start px-8  items-center mb-4'>
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
      <div ref={containerRef} className='flex-shrink overflow-hidden w-full'>
        <Editor
          height="50vh"
          width={dimensions.width}
          language={selectedLanguage}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            theme: 'customTheme',
            formatOnPaste: true,
            cursorBlinking: "smooth",
            fontSize: 18,
          }}
          className="flex"
        />
      </div>
    </div>
  );
}