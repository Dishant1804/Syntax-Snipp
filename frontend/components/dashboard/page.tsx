"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sidebar } from '@/components/sidebar/Page'
import { SearchComponent } from "../search/Page"
import { MainSnippetComponent } from "../mainsnippet/page"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function DashboardComponent() {
  const [isSnippetDeleted, setIsSnippetDeleted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"allsnippets" | "mysnippets" | "favorites">("allsnippets");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="h-screen w-screen bg-[#111111] relative overflow-hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-30
          ${isSidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={() => setIsSidebarCollapsed(true)}
      />

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out bg-[#111111]
          ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}
        style={{
          width: '280px',
        }}
      >
        <div className="relative h-full">
          <Sidebar isCollapsed={false} />
          <button
            onClick={toggleSidebar}
            className="absolute top-4 -right-3 bg-slate-800 rounded-full p-1 hover:bg-slate-700 z-50"
          >
            <ChevronLeft className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Collapsed Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out bg-[#111111] w-20
          ${isSidebarCollapsed ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="relative h-full">
          <Sidebar isCollapsed={true} />
          <button
            onClick={toggleSidebar}
            className="absolute top-4 -right-3 bg-slate-800 rounded-full p-1 hover:bg-slate-700 z-50"
          >
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`h-full transition-all duration-300 ease-in-out`}
        style={{ marginLeft: isSidebarCollapsed ? '64px' : '280px' }}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            maxSize={44}
            defaultSize={40}
            className="transition-all duration-300 ease-in-out"
          >
            <SearchComponent
              isSnippetDeleted={isSnippetDeleted}
              setIsSnippetDeleted={setIsSnippetDeleted}
              setActiveTab={setActiveTab}
            />
          </ResizablePanel>
          <ResizableHandle className="h-screen bg-slate-400/20" />
          <ResizablePanel
            minSize={44}
            defaultSize={60}
            className="transition-all duration-300 ease-in-out"
          >
            <MainSnippetComponent
              setIsSnippetDeleted={setIsSnippetDeleted}
              activeTab={activeTab}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}