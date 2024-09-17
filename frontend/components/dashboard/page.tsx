"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sidebar } from '../sidebar/Page'
import { SearchComponent } from "../search/Page"
import { MainSnippetComponent } from "../mainsnippet/page"

export default function DashboardComponent() {

  return (
    <div className="h-screen w-screen bg-[#111111] flex flex-row justify-center">
      <ResizablePanelGroup direction="horizontal" className="">
        <ResizablePanel minSize={18} defaultSize={18} maxSize={24} >
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle className="h-screen bg-slate-400/20 " />
        <ResizablePanel minSize={32} defaultSize={34} maxSize={44} >
          <SearchComponent />
        </ResizablePanel>
        <ResizableHandle withHandle className="h-screen bg-slate-400/20 " />
        <ResizablePanel minSize={44} defaultSize={48}>
          <MainSnippetComponent />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}



