"use client"

import Link from "next/link"
import { SpinnerWithText } from "@/components/ui/spinnerWithText"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Sidebar } from '../sidebar/Page'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios';
import { SearchComponent } from "../search/Page"

interface Snippet {
  id: string;
  content: string;
  description: string;
  favorite?: boolean
}

export default function DashboardComponent() {

  // useEffect(() => {
  //   const token = 

  // }, [])

  return (
    <div className="h-screen w-screen bg-[#111111] flex flex-row justify-center">
      <ResizablePanelGroup direction="horizontal" className="">
        <ResizablePanel minSize={18} defaultSize={18} maxSize={24} >
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle className="h-screen bg-slate-400/20 " />
        <ResizablePanel minSize={28} defaultSize={34} maxSize={44} >
          <SearchComponent />
        </ResizablePanel>
        <ResizableHandle withHandle className="h-screen bg-slate-400/20 " />
        <ResizablePanel minSize={44} defaultSize={48}>
          Main component
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}



