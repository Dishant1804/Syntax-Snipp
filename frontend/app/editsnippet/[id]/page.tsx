"use client"

import EditSnippetComponent from "@/components/editsnippet/page";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sidebar } from '@/components/sidebar/Page'


const CreateSnippet = () => {
  return <>
    <div className="h-screen w-screen bg-[#111111] flex flex-row justify-center">
      <ResizablePanelGroup direction="horizontal" className="">
        <ResizablePanel minSize={18} defaultSize={18}  maxSize={24}>
          <Sidebar isCollapsed={false}/>
        </ResizablePanel>
        <ResizableHandle className="h-screen bg-slate-400/20 " />
        <ResizablePanel minSize={24} defaultSize={82} >
          <EditSnippetComponent />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  </>
}

export default CreateSnippet