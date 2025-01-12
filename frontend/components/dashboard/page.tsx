"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sidebar }  from '@/components/sidebar/Page'
import { SearchComponent } from "../search/Page"
import { MainSnippetComponent } from "../mainsnippet/page"
import { use, useState } from "react"


export default function DashboardComponent() {
  const [isSnippetDeleted , setIsSnippetDeleted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"allsnippets" | "mysnippets" | "favorites">("allsnippets");

  return (
    <>
      <div className="h-screen w-screen bg-[#111111] flex flex-row justify-center">
        <ResizablePanelGroup direction="horizontal" className="">
          <ResizablePanel minSize={18} defaultSize={18} maxSize={24} >
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle className="h-screen bg-slate-400/20 " />
          <ResizablePanel minSize={32} defaultSize={34} maxSize={44} >
            <SearchComponent isSnippetDeleted={isSnippetDeleted} setIsSnippetDeleted={setIsSnippetDeleted} setActiveTab={setActiveTab} />
          </ResizablePanel>
          <ResizableHandle className="h-screen bg-slate-400/20 " />
          <ResizablePanel minSize={44} defaultSize={48}>
            <MainSnippetComponent setIsSnippetDeleted={setIsSnippetDeleted} activeTab={activeTab} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  )
}



