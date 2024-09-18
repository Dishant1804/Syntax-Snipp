import { Editor, Monaco } from '@monaco-editor/react';
import { customTheme } from '@/helpers/helper';
import { useEffect, useRef, useState } from 'react';

export const MonacoEditorDisplaySnippetComponent = () => {
  const monacoRef = useRef<Monaco | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: '100%' });

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('customTheme', customTheme);
    monacoRef.current = monaco;
  }

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monaco.editor.setTheme('customTheme');

    editor.updateOptions({
      readOnly: true,
      cursorBlinking: 'hidden',
      renderLineHighlight: 'none',
    });

    editor._domElement.style.caretColor = 'transparent';
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

  return (
    <div className='px-4 mx-6 mt-4 max-h-screen bg-[#1a1a1a] flex flex-col justify-center items-center rounded-xl'>
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
      <div className='flex flex-row w-full justify-start px-2 items-center mb-4'>
        <div ref={containerRef} className='flex-shrink overflow-hidden w-full'>
          <Editor
            height="60vh"
            width={dimensions.width}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              // language: { snippet.language }, // Add the language to the snippet (assuming you have it available)
              theme: 'customTheme',
              formatOnPaste: true,
              fontSize: 18,
            }}
            value='console.log("hello world")'
            className="flex"
          />
        </div>
      </div>
    </div>
  );
}