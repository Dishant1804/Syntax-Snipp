import { Editor, Monaco } from '@monaco-editor/react'
import { customTheme } from '@/helpers/helper'
import { useRef } from 'react'

const MonacoEditorComponent = () => {
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('customTheme', customTheme);
    monacoRef.current = monaco;
  }

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monaco.editor.setTheme('customTheme');
  }

  return <div className='px-8 mt-4'>
    <Editor
      height="60vh"
      language="javascript"
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        theme: 'customTheme',
      }}
      className='rounded-lg'
    />
  </div>
}
