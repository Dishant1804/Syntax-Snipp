import React, { useRef, useState } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import { Copy, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { customTheme } from '@/helpers/helper';
import { editor } from 'monaco-editor';
import { useToast } from '@/hooks/use-toast';

type SnippetContent = {
  content: string;
  language: string;
}

const MonacoEditorShareSnippetComponent: React.FC<SnippetContent> = ({ content, language }) => {
  const monacoRef = useRef<Monaco | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('customTheme', customTheme);
    monacoRef.current = monaco;
  }

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    monaco.editor.setTheme('customTheme');
    editor.updateOptions({
      readOnly: true,
      cursorBlinking: 'smooth',
      renderLineHighlight: 'none',
    });
    const editorElement = editor.getContainerDomNode();
    editorElement.style.caretColor = '#272729';
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      //console.error('Failed to copy text: ', err);
      toast({
        title: "Something went wrong",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return (
    <div className='bg-[#1a1a1a] flex flex-col rounded-xl font-sans h-full'>
      <div className='flex flex-row w-full'>
        <div className='flex flex-row justify-start gap-2 items-center pt-4 pb-4 pl-6'>
          <div className='bg-red-500 h-3 w-3 rounded-full'></div>
          <div className='bg-yellow-500 h-3 w-3 rounded-full'></div>
          <div className='bg-green-500 h-3 w-3 rounded-full'></div>
        </div>
        <div className='flex items-center font-mono justify-center w-full text-white/90'>
          ~/Syntax-snipp/sharesnippet
        </div>
      </div>
      <div className='flex justify-between items-center w-full px-6 font-mono text-md mb-3 text-[#aeafb2]'>
        <div className='border px-2 py-1 border-slate-400/20 rounded-lg'>
          {language}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                className='p-2 rounded-lg items-center flex hover:bg-gray-700/20 cursor-pointer'
                onClick={handleCopy}
              >
                {copied ? <Check className='h-5 w-5 items-center text-green-500' /> : <Copy className='h-5 w-5 items-center' />}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {copied ? 'Copied!' : 'Copy'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className='pb-2'>
        <Editor
          height="60vh"
          language={language}
          value={content}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            theme: 'customTheme',
            formatOnPaste: true,
            fontSize: 16,
            readOnly: true,
            domReadOnly: true,
            renderLineHighlight: 'none',
            tabSize: 4,
            scrollBeyondLastLine: false,
          }}
          className="flex pb-2"
        />
      </div>
    </div>
  );
}

export default MonacoEditorShareSnippetComponent;
