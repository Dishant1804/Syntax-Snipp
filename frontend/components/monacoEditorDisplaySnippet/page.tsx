import React, { useEffect, useRef, useState } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import { customTheme } from '@/helpers/helper';
import { Copy, Check, Maximize2, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { editor } from 'monaco-editor';
import { useToast } from '@/hooks/use-toast';
import { DialogTitle } from '@radix-ui/react-dialog';

type SnippetContent = {
  content: string;
  language: string;
  title: string;
}

export const MonacoEditorDisplaySnippetComponent = ({ content, language, title }: SnippetContent) => {
  const monacoRef = useRef<Monaco | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: '100%' });
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
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

  useEffect(() => {
    const updateDimensions = (): void => {
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to copy text: ', err);
      }
      toast({
        title: "Something went wrong",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return (
    <div className='px-4 mx-6 mt-4 max-h-screen bg-[#1a1a1a] flex flex-col justify-center items-center rounded-xl font-sans'>
      <div className='flex flex-row w-full'>
        <div className='flex flex-row justify-start gap-2 items-center pt-4 pb-4 pl-3'>
          <div className='bg-red-500 h-3 w-3 rounded-full'></div>
          <div className='bg-yellow-500 h-3 w-3 rounded-full'></div>
          <div className='bg-green-500 h-3 w-3 rounded-full'></div>
        </div>
        <div className='flex text-sm items-center font-mono justify-center w-full text-white/90'>
          ~/Syntax-snip/{title}
        </div>
      </div>
      <div className='h-auto flex justify-between items-center w-full px-10 font-mono text-md mb-3 text-[#aeafb2]'>
        <div className='border text-sm px-2 py-1 border-slate-400/20 rounded-lg'>
          {language}
        </div>
        <div className='flex flex-row gap-2 items-center'>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className='p-2 rounded-lg items-center flex hover:bg-gray-700/20 cursor-pointer'
                  onClick={() => setFullscreen(true)}
                >
                  <Maximize2 className='h-5 w-5 items-center' />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Fullscreen
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className='flex flex-row w-full justify-start px-2 items-center mb-4'>
        <div ref={containerRef} className='flex-shrink overflow-hidden w-full'>
          <Editor
            height="55vh"
            width={dimensions.width}
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
            }}
            className="flex"
          />
        </div>
      </div>
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogTitle>
        </DialogTitle>
        <DialogContent className="p-0 max-w-full overflow-hidden max-h-full w-[90vw] h-[90vh] bg-[#1a1a1a] flex flex-col">
          <div className='flex flex-row w-full relative p-2'>
            <div className='flex flex-row justify-start gap-2 items-center pt-4 pb-4 pl-3'>
              <div className='bg-red-500 h-3 w-3 rounded-full'></div>
              <div className='bg-yellow-500 h-3 w-3 rounded-full'></div>
              <div className='bg-green-500 h-3 w-3 rounded-full'></div>
            </div>
            <div className='flex text-sm items-center font-mono justify-center w-full text-white/90'>
              ~/Syntax-snipp/{title}
            </div>
            <div className='flex absolute z-[50] top-10 right-20'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className='p-2 rounded-lg items-center flex hover:bg-gray-700/20 cursor-pointer'
                      onClick={handleCopy}
                    >
                      {copied ? <Check className='h-5 w-5 items-center text-green-500' /> : <Copy className='h-5 w-5 items-center text-white' />}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copied ? 'Copied!' : 'Copy'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex-1 flex flex-col px-4 pb-4">
            <Editor
              height="100%"
              width="100%"
              language={language}
              value={content}
              beforeMount={handleEditorWillMount}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                theme: 'customTheme',
                formatOnPaste: true,
                fontSize: 18,
                readOnly: true,
                domReadOnly: true,
                renderLineHighlight: 'none',
                tabSize: 4,
              }}
              className="flex-1"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
